using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using CollabAzure.Services;
using CollabAzure.Models;
using System.Security.Claims;

namespace CollabAzure.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TripSheetController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IGeofenceService _geofenceService;
        private readonly ILocationService _locationService;
        private readonly ILogger<TripSheetController> _logger;

        public TripSheetController(
            ApplicationDbContext context,
            IGeofenceService geofenceService,
            ILocationService locationService,
            ILogger<TripSheetController> logger)
        {
            _context = context;
            _geofenceService = geofenceService;
            _locationService = locationService;
            _logger = logger;
        }

        /// <summary>
        /// Create a new trip sheet
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateTripSheet([FromBody] CreateTripSheetRequest request)
        {
            try
            {
                // Validate driver exists and belongs to current user
                var driverId = Guid.Parse(User.FindFirst("driver_id")?.Value ?? "");
                var driver = await _context.Drivers
                    .Include(d => d.User)
                    .FirstOrDefaultAsync(d => d.Id == driverId);

                if (driver == null)
                {
                    return BadRequest("Driver not found");
                }

                // Validate vehicle availability
                var vehicle = await _context.Vehicles
                    .FirstOrDefaultAsync(v => v.Id == request.VehicleId && v.Status == VehicleStatus.Available);

                if (vehicle == null)
                {
                    return BadRequest("Vehicle not available");
                }

                // Generate trip number
                var tripNumber = await GenerateTripNumber();

                // Resolve pickup location
                var pickupLocation = await ResolveOrCreateLocation(request.PickupLocation);
                
                // Resolve delivery location (optional)
                Location? deliveryLocation = null;
                if (request.DeliveryLocation != null)
                {
                    deliveryLocation = await ResolveOrCreateLocation(request.DeliveryLocation);
                }

                // Create trip sheet
                var tripSheet = new TripSheet
                {
                    Id = Guid.NewGuid(),
                    DriverId = driverId,
                    VehicleId = request.VehicleId,
                    TripNumber = tripNumber,
                    DriverName = request.DriverName,
                    DriverPhone = request.DriverPhone,
                    VehicleNumber = request.VehicleNumber,
                    TrailerNumber = request.TrailerNumber,
                    
                    // Pickup information
                    PickupLocationId = pickupLocation.Id,
                    PickupLocationName = request.PickupLocation.Name,
                    PickupAddress = request.PickupLocation.Address,
                    PickupPhone = request.PickupLocation.Phone,
                    PickupPoNumber = request.PickupPoNumber,
                    PickupAppointmentDate = request.PickupAppointmentDate?.Date,
                    PickupAppointmentTime = request.PickupAppointmentTime?.TimeOfDay,
                    PickupSpecialInstructions = request.PickupSpecialInstructions,
                    
                    // Delivery information
                    DeliveryLocationId = deliveryLocation?.Id,
                    DeliveryLocationName = request.DeliveryLocation?.Name,
                    DeliveryAddress = request.DeliveryLocation?.Address,
                    DeliveryPhone = request.DeliveryLocation?.Phone,
                    DeliveryAppointmentDate = request.DeliveryAppointmentDate?.Date,
                    DeliveryAppointmentTime = request.DeliveryAppointmentTime?.TimeOfDay,
                    DeliverySpecialInstructions = request.DeliverySpecialInstructions,
                    
                    // Load information
                    LoadDescription = request.LoadDescription,
                    LoadWeight = request.LoadWeight,
                    LoadPieces = request.LoadPieces,
                    LoadValue = request.LoadValue,
                    Hazmat = request.Hazmat,
                    
                    Status = TripStatus.Created,
                    CreatedAt = DateTime.UtcNow
                };

                _context.TripSheets.Add(tripSheet);

                // Update vehicle status
                vehicle.Status = VehicleStatus.InUse;
                vehicle.CurrentDriverId = driverId;

                // Update driver status
                driver.Status = DriverStatus.OnTrip;

                await _context.SaveChangesAsync();

                // Start location tracking for this trip
                await _locationService.StartTripTracking(tripSheet.Id, driverId);

                _logger.LogInformation($"Created trip sheet {tripNumber} for driver {driver.DriverLicense}");

                return Ok(new
                {
                    tripSheet.Id,
                    tripSheet.TripNumber,
                    tripSheet.Status,
                    PickupLocation = pickupLocation,
                    DeliveryLocation = deliveryLocation,
                    Message = "Trip sheet created successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating trip sheet");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get trip sheets for current driver
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetTripSheets(
            [FromQuery] TripStatus? status = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var driverId = Guid.Parse(User.FindFirst("driver_id")?.Value ?? "");
                
                var query = _context.TripSheets
                    .Include(ts => ts.PickupLocation)
                    .Include(ts => ts.DeliveryLocation)
                    .Include(ts => ts.Vehicle)
                    .Where(ts => ts.DriverId == driverId);

                if (status.HasValue)
                {
                    query = query.Where(ts => ts.Status == status.Value);
                }

                var totalCount = await query.CountAsync();
                
                var tripSheets = await query
                    .OrderByDescending(ts => ts.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(ts => new
                    {
                        ts.Id,
                        ts.TripNumber,
                        ts.Status,
                        ts.DriverName,
                        ts.VehicleNumber,
                        ts.TrailerNumber,
                        ts.PickupLocationName,
                        ts.PickupAddress,
                        ts.PickupPoNumber,
                        ts.PickupAppointmentDate,
                        ts.PickupAppointmentTime,
                        ts.DeliveryLocationName,
                        ts.DeliveryAddress,
                        ts.LoadDescription,
                        ts.CreatedAt,
                        ts.StartedAt,
                        ts.CompletedAt,
                        PickupLocation = new
                        {
                            ts.PickupLocation!.Id,
                            ts.PickupLocation.Name,
                            ts.PickupLocation.Latitude,
                            ts.PickupLocation.Longitude,
                            ts.PickupLocation.GeofenceRadius
                        },
                        DeliveryLocation = ts.DeliveryLocation != null ? new
                        {
                            ts.DeliveryLocation.Id,
                            ts.DeliveryLocation.Name,
                            ts.DeliveryLocation.Latitude,
                            ts.DeliveryLocation.Longitude,
                            ts.DeliveryLocation.GeofenceRadius
                        } : null
                    })
                    .ToListAsync();

                return Ok(new
                {
                    TripSheets = tripSheets,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting trip sheets");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get specific trip sheet by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTripSheet(Guid id)
        {
            try
            {
                var driverId = Guid.Parse(User.FindFirst("driver_id")?.Value ?? "");
                
                var tripSheet = await _context.TripSheets
                    .Include(ts => ts.Driver)
                    .Include(ts => ts.Vehicle)
                    .Include(ts => ts.PickupLocation)
                    .Include(ts => ts.DeliveryLocation)
                    .Where(ts => ts.Id == id && ts.DriverId == driverId)
                    .FirstOrDefaultAsync();

                if (tripSheet == null)
                {
                    return NotFound("Trip sheet not found");
                }

                return Ok(tripSheet);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting trip sheet {id}");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Update trip status
        /// </summary>
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateTripStatus(Guid id, [FromBody] UpdateTripStatusRequest request)
        {
            try
            {
                var driverId = Guid.Parse(User.FindFirst("driver_id")?.Value ?? "");
                
                var tripSheet = await _context.TripSheets
                    .Include(ts => ts.Vehicle)
                    .Include(ts => ts.Driver)
                    .Where(ts => ts.Id == id && ts.DriverId == driverId)
                    .FirstOrDefaultAsync();

                if (tripSheet == null)
                {
                    return NotFound("Trip sheet not found");
                }

                var oldStatus = tripSheet.Status;
                tripSheet.Status = request.Status;
                tripSheet.UpdatedAt = DateTime.UtcNow;

                // Update timestamps based on status
                switch (request.Status)
                {
                    case TripStatus.EnRoutePickup:
                        tripSheet.StartedAt = DateTime.UtcNow;
                        break;
                    case TripStatus.PickupCompleted:
                        tripSheet.PickupCompletedAt = DateTime.UtcNow;
                        break;
                    case TripStatus.DeliveryCompleted:
                        tripSheet.DeliveryCompletedAt = DateTime.UtcNow;
                        break;
                    case TripStatus.Completed:
                        tripSheet.CompletedAt = DateTime.UtcNow;
                        // Release vehicle and update driver status
                        tripSheet.Vehicle!.Status = VehicleStatus.Available;
                        tripSheet.Vehicle.CurrentDriverId = null;
                        tripSheet.Driver!.Status = DriverStatus.Available;
                        break;
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Updated trip {tripSheet.TripNumber} status from {oldStatus} to {request.Status}");

                return Ok(new
                {
                    tripSheet.Id,
                    tripSheet.TripNumber,
                    OldStatus = oldStatus.ToString(),
                    NewStatus = request.Status.ToString(),
                    UpdatedAt = tripSheet.UpdatedAt,
                    Message = "Trip status updated successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating trip status for {id}");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Cancel trip sheet
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelTripSheet(Guid id, [FromBody] CancelTripRequest request)
        {
            try
            {
                var driverId = Guid.Parse(User.FindFirst("driver_id")?.Value ?? "");
                
                var tripSheet = await _context.TripSheets
                    .Include(ts => ts.Vehicle)
                    .Include(ts => ts.Driver)
                    .Where(ts => ts.Id == id && ts.DriverId == driverId)
                    .FirstOrDefaultAsync();

                if (tripSheet == null)
                {
                    return NotFound("Trip sheet not found");
                }

                if (tripSheet.Status == TripStatus.Completed || tripSheet.Status == TripStatus.Cancelled)
                {
                    return BadRequest("Cannot cancel completed or already cancelled trip");
                }

                tripSheet.Status = TripStatus.Cancelled;
                tripSheet.UpdatedAt = DateTime.UtcNow;

                // Release vehicle and update driver status
                if (tripSheet.Vehicle != null)
                {
                    tripSheet.Vehicle.Status = VehicleStatus.Available;
                    tripSheet.Vehicle.CurrentDriverId = null;
                }

                if (tripSheet.Driver != null)
                {
                    tripSheet.Driver.Status = DriverStatus.Available;
                }

                await _context.SaveChangesAsync();

                // Stop location tracking
                await _locationService.StopTripTracking(tripSheet.Id);

                _logger.LogInformation($"Cancelled trip {tripSheet.TripNumber}. Reason: {request.Reason}");

                return Ok(new
                {
                    tripSheet.Id,
                    tripSheet.TripNumber,
                    Status = tripSheet.Status.ToString(),
                    CancellationReason = request.Reason,
                    CancelledAt = tripSheet.UpdatedAt,
                    Message = "Trip cancelled successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error cancelling trip {id}");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get active trip for current driver
        /// </summary>
        [HttpGet("active")]
        public async Task<IActionResult> GetActiveTrip()
        {
            try
            {
                var driverId = Guid.Parse(User.FindFirst("driver_id")?.Value ?? "");
                
                var activeTrip = await _context.TripSheets
                    .Include(ts => ts.PickupLocation)
                    .Include(ts => ts.DeliveryLocation)
                    .Include(ts => ts.Vehicle)
                    .Where(ts => ts.DriverId == driverId && 
                                ts.Status != TripStatus.Completed && 
                                ts.Status != TripStatus.Cancelled)
                    .OrderBy(ts => ts.CreatedAt)
                    .FirstOrDefaultAsync();

                if (activeTrip == null)
                {
                    return Ok(new { ActiveTrip = (object?)null, Message = "No active trip found" });
                }

                return Ok(new { ActiveTrip = activeTrip });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting active trip");
                return StatusCode(500, "Internal server error");
            }
        }

        private async Task<string> GenerateTripNumber()
        {
            var today = DateTime.UtcNow.Date;
            var prefix = $"T{today:yyyyMMdd}";
            
            var lastTrip = await _context.TripSheets
                .Where(ts => ts.TripNumber.StartsWith(prefix))
                .OrderByDescending(ts => ts.TripNumber)
                .FirstOrDefaultAsync();

            int sequence = 1;
            if (lastTrip != null)
            {
                var lastSequence = lastTrip.TripNumber.Substring(prefix.Length);
                if (int.TryParse(lastSequence, out int lastSeq))
                {
                    sequence = lastSeq + 1;
                }
            }

            return $"{prefix}{sequence:D4}";
        }

        private async Task<Location> ResolveOrCreateLocation(LocationRequest locationRequest)
        {
            // Try to find existing location by name and address
            var existingLocation = await _context.Locations
                .FirstOrDefaultAsync(l => l.Name == locationRequest.Name && 
                                         l.Address == locationRequest.Address);

            if (existingLocation != null)
            {
                return existingLocation;
            }

            // Create new location
            var newLocation = new Location
            {
                Id = Guid.NewGuid(),
                Name = locationRequest.Name,
                Address = locationRequest.Address,
                Phone = locationRequest.Phone,
                Latitude = locationRequest.Latitude,
                Longitude = locationRequest.Longitude,
                GeofenceRadius = locationRequest.GeofenceRadius ?? 200,
                LocationType = locationRequest.Type ?? LocationType.Warehouse,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Locations.Add(newLocation);
            return newLocation;
        }
    }

    // Request DTOs
    public class CreateTripSheetRequest
    {
        public Guid VehicleId { get; set; }
        public string DriverName { get; set; } = string.Empty;
        public string DriverPhone { get; set; } = string.Empty;
        public string VehicleNumber { get; set; } = string.Empty;
        public string? TrailerNumber { get; set; }
        
        public LocationRequest PickupLocation { get; set; } = new();
        public string PickupPoNumber { get; set; } = string.Empty;
        public DateTime? PickupAppointmentDate { get; set; }
        public DateTime? PickupAppointmentTime { get; set; }
        public string? PickupSpecialInstructions { get; set; }
        
        public LocationRequest? DeliveryLocation { get; set; }
        public DateTime? DeliveryAppointmentDate { get; set; }
        public DateTime? DeliveryAppointmentTime { get; set; }
        public string? DeliverySpecialInstructions { get; set; }
        
        public string? LoadDescription { get; set; }
        public int? LoadWeight { get; set; }
        public int? LoadPieces { get; set; }
        public decimal? LoadValue { get; set; }
        public bool Hazmat { get; set; }
    }

    public class LocationRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public int? GeofenceRadius { get; set; }
        public LocationType? Type { get; set; }
    }

    public class UpdateTripStatusRequest
    {
        public TripStatus Status { get; set; }
        public string? Notes { get; set; }
    }

    public class CancelTripRequest
    {
        public string Reason { get; set; } = string.Empty;
    }
}



