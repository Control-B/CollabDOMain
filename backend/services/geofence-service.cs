using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NetTopologySuite.Geometries;
using NetTopologySuite;

namespace CollabAzure.Services
{
    public interface IGeofenceService
    {
        Task<bool> CheckGeofenceEntry(Guid driverId, decimal latitude, decimal longitude);
        Task<List<GeofenceCheckIn>> GetRecentCheckIns(int hours = 24);
        Task<GeofenceCheckIn> ProcessCheckIn(GeofenceCheckInRequest request);
        Task<List<Location>> GetNearbyLocations(decimal latitude, decimal longitude, int radiusMeters = 5000);
        Task SendCheckInNotification(GeofenceCheckIn checkIn);
    }

    public class GeofenceService : IGeofenceService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<GeofenceService> _logger;
        private readonly INotificationService _notificationService;
        private readonly IChannelService _channelService;
        private readonly GeofenceOptions _options;
        private readonly GeometryFactory _geometryFactory;

        public GeofenceService(
            ApplicationDbContext context,
            ILogger<GeofenceService> logger,
            INotificationService notificationService,
            IChannelService channelService,
            IOptions<GeofenceOptions> options)
        {
            _context = context;
            _logger = logger;
            _notificationService = notificationService;
            _channelService = channelService;
            _options = options.Value;
            _geometryFactory = NtsGeometryServices.Instance.CreateGeometryFactory(srid: 4326);
        }

        public async Task<bool> CheckGeofenceEntry(Guid driverId, decimal latitude, decimal longitude)
        {
            try
            {
                // Get driver's current active trip
                var activeTrip = await _context.TripSheets
                    .Include(ts => ts.PickupLocation)
                    .Include(ts => ts.DeliveryLocation)
                    .Where(ts => ts.DriverId == driverId && 
                                ts.Status != TripStatus.Completed && 
                                ts.Status != TripStatus.Cancelled)
                    .OrderBy(ts => ts.CreatedAt)
                    .FirstOrDefaultAsync();

                if (activeTrip == null)
                {
                    _logger.LogInformation($"No active trip found for driver {driverId}");
                    return false;
                }

                var currentPoint = _geometryFactory.CreatePoint(new Coordinate((double)longitude, (double)latitude));
                var checkInProcessed = false;

                // Check pickup location geofence
                if (activeTrip.Status == TripStatus.Created || activeTrip.Status == TripStatus.EnRoutePickup)
                {
                    if (await IsWithinGeofence(currentPoint, activeTrip.PickupLocation))
                    {
                        await ProcessGeofenceEntry(activeTrip, activeTrip.PickupLocation, 
                            GeofenceCheckInType.PickupArrival, latitude, longitude, driverId);
                        checkInProcessed = true;
                    }
                }

                // Check delivery location geofence
                if (activeTrip.Status == TripStatus.Loaded || activeTrip.Status == TripStatus.EnRouteDelivery)
                {
                    if (activeTrip.DeliveryLocation != null && 
                        await IsWithinGeofence(currentPoint, activeTrip.DeliveryLocation))
                    {
                        await ProcessGeofenceEntry(activeTrip, activeTrip.DeliveryLocation, 
                            GeofenceCheckInType.DeliveryArrival, latitude, longitude, driverId);
                        checkInProcessed = true;
                    }
                }

                return checkInProcessed;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error checking geofence entry for driver {driverId}");
                return false;
            }
        }

        private async Task<bool> IsWithinGeofence(Point currentPoint, Location location)
        {
            if (location?.Geom == null) return false;

            // Calculate distance using PostGIS ST_Distance
            var query = @"
                SELECT ST_Distance(
                    ST_SetSRID(ST_MakePoint(@longitude, @latitude), 4326)::geography,
                    @locationGeom::geography
                ) as distance";

            var distance = await _context.Database
                .SqlQueryRaw<double>(query, 
                    new { longitude = currentPoint.X, latitude = currentPoint.Y, locationGeom = location.Geom })
                .FirstOrDefaultAsync();

            return distance <= location.GeofenceRadius;
        }

        private async Task ProcessGeofenceEntry(TripSheet trip, Location location, 
            GeofenceCheckInType checkInType, decimal latitude, decimal longitude, Guid driverId)
        {
            // Check if we already have a recent check-in for this location
            var recentCheckIn = await _context.GeofenceCheckIns
                .Where(gc => gc.TripSheetId == trip.Id && 
                            gc.LocationId == location.Id && 
                            gc.CheckInType == checkInType &&
                            gc.CreatedAt >= DateTime.UtcNow.AddMinutes(-30)) // 30-minute cooldown
                .FirstOrDefaultAsync();

            if (recentCheckIn != null)
            {
                _logger.LogInformation($"Recent check-in already exists for trip {trip.Id} at location {location.Id}");
                return;
            }

            // Calculate distance from geofence center
            var distanceFromCenter = await CalculateDistance(latitude, longitude, 
                location.Latitude, location.Longitude);

            // Create check-in record
            var checkIn = new GeofenceCheckIn
            {
                Id = Guid.NewGuid(),
                TripSheetId = trip.Id,
                DriverId = driverId,
                LocationId = location.Id,
                CheckInType = checkInType,
                Latitude = latitude,
                Longitude = longitude,
                GeofenceRadiusUsed = location.GeofenceRadius,
                DistanceFromCenter = distanceFromCenter,
                IsAutomatic = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.GeofenceCheckIns.Add(checkIn);

            // Update trip status
            switch (checkInType)
            {
                case GeofenceCheckInType.PickupArrival:
                    trip.Status = TripStatus.ArrivedPickup;
                    trip.PickupArrivedAt = DateTime.UtcNow;
                    break;
                case GeofenceCheckInType.DeliveryArrival:
                    trip.Status = TripStatus.ArrivedDelivery;
                    trip.DeliveryArrivedAt = DateTime.UtcNow;
                    break;
            }

            await _context.SaveChangesAsync();

            // Send notification asynchronously
            _ = Task.Run(async () => await SendCheckInNotification(checkIn));

            _logger.LogInformation($"Processed geofence check-in: Trip {trip.TripNumber}, " +
                                 $"Location {location.Name}, Type {checkInType}");
        }

        public async Task<GeofenceCheckIn> ProcessCheckIn(GeofenceCheckInRequest request)
        {
            var trip = await _context.TripSheets
                .Include(ts => ts.Driver)
                .Include(ts => ts.PickupLocation)
                .Include(ts => ts.DeliveryLocation)
                .FirstOrDefaultAsync(ts => ts.Id == request.TripSheetId);

            if (trip == null)
            {
                throw new ArgumentException($"Trip sheet not found: {request.TripSheetId}");
            }

            var location = await _context.Locations
                .FirstOrDefaultAsync(l => l.Id == request.LocationId);

            if (location == null)
            {
                throw new ArgumentException($"Location not found: {request.LocationId}");
            }

            var distanceFromCenter = await CalculateDistance(
                request.Latitude, request.Longitude,
                location.Latitude, location.Longitude);

            var checkIn = new GeofenceCheckIn
            {
                Id = Guid.NewGuid(),
                TripSheetId = request.TripSheetId,
                DriverId = trip.DriverId,
                LocationId = request.LocationId,
                CheckInType = request.CheckInType,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                GeofenceRadiusUsed = location.GeofenceRadius,
                DistanceFromCenter = distanceFromCenter,
                LocationAccuracy = request.LocationAccuracy,
                DeviceId = request.DeviceId,
                AppVersion = request.AppVersion,
                IsAutomatic = request.IsAutomatic,
                ManualReason = request.ManualReason,
                CreatedAt = DateTime.UtcNow
            };

            _context.GeofenceCheckIns.Add(checkIn);
            await _context.SaveChangesAsync();

            // Send notification
            await SendCheckInNotification(checkIn);

            return checkIn;
        }

        public async Task SendCheckInNotification(GeofenceCheckIn checkIn)
        {
            try
            {
                var trip = await _context.TripSheets
                    .Include(ts => ts.Driver)
                    .Include(ts => ts.Vehicle)
                    .Include(ts => ts.PickupLocation)
                    .ThenInclude(pl => pl.Company)
                    .Include(ts => ts.DeliveryLocation)
                    .ThenInclude(dl => dl.Company)
                    .FirstOrDefaultAsync(ts => ts.Id == checkIn.TripSheetId);

                var location = await _context.Locations
                    .Include(l => l.Company)
                    .FirstOrDefaultAsync(l => l.Id == checkIn.LocationId);

                if (trip == null || location == null) return;

                // Get shipping office configuration
                var shippingConfig = await _context.ShippingOfficeConfigs
                    .FirstOrDefaultAsync(soc => soc.CompanyId == location.CompanyId);

                // Determine notification recipients (shipping office clerks)
                var recipients = await GetNotificationRecipients(location.CompanyId);

                var notification = new CheckInNotification
                {
                    Type = "geofence_checkin",
                    Title = $"Driver Check-In: {checkIn.CheckInType.ToString().Replace("_", " ")}",
                    Message = $"{trip.DriverName} has arrived at {location.Name}",
                    TripSheet = new TripSheetSummary
                    {
                        TripNumber = trip.TripNumber,
                        DriverName = trip.DriverName,
                        DriverPhone = trip.DriverPhone,
                        VehicleNumber = trip.VehicleNumber,
                        TrailerNumber = trip.TrailerNumber,
                        PickupLocationName = trip.PickupLocationName,
                        PickupAddress = trip.PickupAddress,
                        PickupPoNumber = trip.PickupPoNumber,
                        DeliveryLocationName = trip.DeliveryLocationName,
                        DeliveryAddress = trip.DeliveryAddress,
                        LoadDescription = trip.LoadDescription,
                        PickupAppointmentDate = trip.PickupAppointmentDate,
                        PickupAppointmentTime = trip.PickupAppointmentTime,
                        DeliveryAppointmentDate = trip.DeliveryAppointmentDate,
                        DeliveryAppointmentTime = trip.DeliveryAppointmentTime
                    },
                    Location = new LocationSummary
                    {
                        Name = location.Name,
                        Address = location.Address,
                        Phone = location.Phone
                    },
                    CheckInDetails = new CheckInDetails
                    {
                        CheckInType = checkIn.CheckInType.ToString(),
                        Timestamp = checkIn.CreatedAt,
                        Latitude = checkIn.Latitude,
                        Longitude = checkIn.Longitude,
                        DistanceFromCenter = checkIn.DistanceFromCenter
                    },
                    Recipients = recipients,
                    CreatedAt = DateTime.UtcNow
                };

                // Send notification to all recipients
                await _notificationService.SendCheckInNotification(notification);

                // Auto-create channel if configured
                if (shippingConfig?.AutoCreateChannels == true)
                {
                    await CreateChannelFromCheckIn(checkIn, trip, location, recipients);
                }

                // Update check-in record
                checkIn.NotificationSent = true;
                checkIn.NotificationSentAt = DateTime.UtcNow;
                checkIn.NotificationRecipients = recipients.Select(r => r.Id).ToList();

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error sending check-in notification for check-in {checkIn.Id}");
            }
        }

        private async Task CreateChannelFromCheckIn(GeofenceCheckIn checkIn, TripSheet trip, 
            Location location, List<NotificationRecipient> recipients)
        {
            try
            {
                var channelName = GenerateChannelName(trip, location);
                
                var channelMembers = recipients.Select(r => r.Id).ToList();
                channelMembers.Add(trip.Driver.UserId); // Add driver to the channel

                var channelRequest = new CreateChannelRequest
                {
                    Name = channelName,
                    Description = $"Trip communication for {trip.TripNumber} at {location.Name}",
                    Type = "trip_communication",
                    Members = channelMembers,
                    Metadata = new Dictionary<string, object>
                    {
                        { "trip_id", trip.Id },
                        { "trip_number", trip.TripNumber },
                        { "location_id", location.Id },
                        { "location_name", location.Name },
                        { "checkin_id", checkIn.Id },
                        { "checkin_type", checkIn.CheckInType.ToString() }
                    }
                };

                var channel = await _channelService.CreateChannel(channelRequest);

                // Update check-in record with channel information
                checkIn.ChannelCreated = true;
                checkIn.ChannelId = channel.Id;
                checkIn.ChannelCreatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Created channel {channel.Id} for check-in {checkIn.Id}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error creating channel for check-in {checkIn.Id}");
            }
        }

        private string GenerateChannelName(TripSheet trip, Location location)
        {
            return $"Trip-{trip.TripNumber}-{location.Name.Replace(" ", "")}";
        }

        private async Task<List<NotificationRecipient>> GetNotificationRecipients(Guid companyId)
        {
            // Get all users who are shipping office clerks for this company
            var recipients = await _context.Users
                .Where(u => u.CompanyId == companyId && 
                           u.UserRoles.Any(ur => ur.Role.Name == "ShippingClerk" || ur.Role.Name == "Dispatcher"))
                .Select(u => new NotificationRecipient
                {
                    Id = u.Id,
                    Name = u.FullName,
                    Email = u.Email,
                    Phone = u.PhoneNumber,
                    PreferredNotificationMethod = u.PreferredNotificationMethod ?? "in_app"
                })
                .ToListAsync();

            return recipients;
        }

        public async Task<List<GeofenceCheckIn>> GetRecentCheckIns(int hours = 24)
        {
            var since = DateTime.UtcNow.AddHours(-hours);
            
            return await _context.GeofenceCheckIns
                .Include(gc => gc.TripSheet)
                .Include(gc => gc.Location)
                .Where(gc => gc.CreatedAt >= since)
                .OrderByDescending(gc => gc.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Location>> GetNearbyLocations(decimal latitude, decimal longitude, 
            int radiusMeters = 5000)
        {
            var query = @"
                SELECT l.* FROM locations l
                WHERE ST_DWithin(
                    l.geom::geography,
                    ST_SetSRID(ST_MakePoint(@longitude, @latitude), 4326)::geography,
                    @radius
                )
                AND l.is_active = true
                ORDER BY ST_Distance(
                    l.geom::geography,
                    ST_SetSRID(ST_MakePoint(@longitude, @latitude), 4326)::geography
                )";

            return await _context.Locations
                .FromSqlRaw(query, 
                    new { longitude = longitude, latitude = latitude, radius = radiusMeters })
                .ToListAsync();
        }

        private async Task<decimal> CalculateDistance(decimal lat1, decimal lng1, decimal lat2, decimal lng2)
        {
            var query = @"
                SELECT ST_Distance(
                    ST_SetSRID(ST_MakePoint(@lng1, @lat1), 4326)::geography,
                    ST_SetSRID(ST_MakePoint(@lng2, @lat2), 4326)::geography
                ) as distance";

            var distance = await _context.Database
                .SqlQueryRaw<double>(query, 
                    new { lng1 = lng1, lat1 = lat1, lng2 = lng2, lat2 = lat2 })
                .FirstOrDefaultAsync();

            return (decimal)distance;
        }
    }

    // Configuration class
    public class GeofenceOptions
    {
        public int DefaultGeofenceRadius { get; set; } = 200; // meters
        public int MaxGeofenceRadius { get; set; } = 1000; // meters
        public int LocationUpdateInterval { get; set; } = 30; // seconds
        public int CheckInCooldownMinutes { get; set; } = 30;
        public bool RequireHighAccuracy { get; set; } = true;
        public decimal MinAccuracyMeters { get; set; } = 50;
    }

    // DTOs and Models
    public class GeofenceCheckInRequest
    {
        public Guid TripSheetId { get; set; }
        public Guid LocationId { get; set; }
        public GeofenceCheckInType CheckInType { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public decimal? LocationAccuracy { get; set; }
        public string DeviceId { get; set; }
        public string AppVersion { get; set; }
        public bool IsAutomatic { get; set; } = true;
        public string ManualReason { get; set; }
    }

    public class CheckInNotification
    {
        public string Type { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public TripSheetSummary TripSheet { get; set; }
        public LocationSummary Location { get; set; }
        public CheckInDetails CheckInDetails { get; set; }
        public List<NotificationRecipient> Recipients { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class TripSheetSummary
    {
        public string TripNumber { get; set; }
        public string DriverName { get; set; }
        public string DriverPhone { get; set; }
        public string VehicleNumber { get; set; }
        public string TrailerNumber { get; set; }
        public string PickupLocationName { get; set; }
        public string PickupAddress { get; set; }
        public string PickupPoNumber { get; set; }
        public string DeliveryLocationName { get; set; }
        public string DeliveryAddress { get; set; }
        public string LoadDescription { get; set; }
        public DateTime? PickupAppointmentDate { get; set; }
        public TimeSpan? PickupAppointmentTime { get; set; }
        public DateTime? DeliveryAppointmentDate { get; set; }
        public TimeSpan? DeliveryAppointmentTime { get; set; }
    }

    public class LocationSummary
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
    }

    public class CheckInDetails
    {
        public string CheckInType { get; set; }
        public DateTime Timestamp { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public decimal? DistanceFromCenter { get; set; }
    }

    public class NotificationRecipient
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string PreferredNotificationMethod { get; set; }
    }

    public enum GeofenceCheckInType
    {
        PickupArrival,
        PickupDeparture,
        DeliveryArrival,
        DeliveryDeparture
    }

    public enum TripStatus
    {
        Created,
        EnRoutePickup,
        ArrivedPickup,
        Loading,
        Loaded,
        EnRouteDelivery,
        ArrivedDelivery,
        Unloading,
        Completed,
        Cancelled
    }
}



