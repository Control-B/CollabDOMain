using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DmsCore.Models;

// Location and facility management
public class Location
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid OrgId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string TimeZone { get; set; } = "UTC";

    [MaxLength(500)]
    public string? Address { get; set; }

    // GeoJSON for gate boundaries (point-in-polygon check)
    public string? GeojsonGate { get; set; }

    // GeoJSON for yard boundaries
    public string? GeojsonYard { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Relationships
    public ICollection<Dock> Docks { get; set; } = new List<Dock>();
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}

// Dock/door management
public enum DockStatus
{
    Available = 0,
    Occupied = 1,
    Down = 2
}

public class Dock
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid LocationId { get; set; }
    public Location? Location { get; set; }

    [Required]
    [MaxLength(50)]
    public string DoorNo { get; set; } = string.Empty;

    // JSON capabilities (e.g., {"type": "loading", "height": "14ft", "equipment": ["forklift"]})
    public string? Capabilities { get; set; }

    public DockStatus Status { get; set; } = DockStatus.Available;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Relationships
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}

// Appointment scheduling
public enum AppointmentStatus
{
    Scheduled = 0,
    Arriving = 1,
    Arrived = 2,
    AtDock = 3,
    Loading = 4,
    Ready = 5,
    Departed = 6,
    NoShow = 7,
    Cancelled = 8
}

public class Appointment
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid LocationId { get; set; }
    public Location? Location { get; set; }

    [Required]
    public Guid CarrierId { get; set; }

    [MaxLength(100)]
    public string? Po { get; set; }

    [MaxLength(100)]
    public string? RefNo { get; set; }

    public DateTime WindowStart { get; set; }
    public DateTime WindowEnd { get; set; }

    public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;

    public int Priority { get; set; } = 5; // 1-10 scale

    public Guid? DockId { get; set; }
    public Dock? Dock { get; set; }

    [Required]
    [MaxLength(200)]
    public string CreatedBy { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Relationships
    public ICollection<CheckIn> CheckIns { get; set; } = new List<CheckIn>();
    public ICollection<EtaUpdate> EtaUpdates { get; set; } = new List<EtaUpdate>();
    public ICollection<LogisticsDocument> LogisticsDocuments { get; set; } = new List<LogisticsDocument>();
    public ICollection<Exception> Exceptions { get; set; } = new List<Exception>();
}

// Check-in tracking (enhanced from existing geofence)
public enum CheckInMethod
{
    Kiosk = 0,
    Mobile = 1,
    Api = 2
}

public class CheckIn
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid AppointmentId { get; set; }
    public Appointment? Appointment { get; set; }

    [Required]
    [MaxLength(200)]
    public string DriverId { get; set; } = string.Empty;

    public CheckInMethod Method { get; set; } = CheckInMethod.Mobile;

    public DateTime At { get; set; } = DateTime.UtcNow;

    [MaxLength(100)]
    public string? GateRef { get; set; }

    // GPS coordinates for verification
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
}

// Trailer/asset management
public enum EquipmentType
{
    Van = 0,
    Reefer = 1,
    Flatbed = 2
}

public enum TrailerStatus
{
    Enroute = 0,
    AtGate = 1,
    InYard = 2,
    AtDock = 3,
    Empty = 4,
    Loaded = 5,
    Ready = 6
}

public class Trailer
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid CarrierId { get; set; }

    public EquipmentType EquipmentType { get; set; } = EquipmentType.Van;

    [Required]
    [MaxLength(50)]
    public string Plate { get; set; } = string.Empty;

    public TrailerStatus Status { get; set; } = TrailerStatus.Enroute;

    // PostGIS geography point for location
    public double? LastLatitude { get; set; }
    public double? LastLongitude { get; set; }

    public DateTime LastSeen { get; set; } = DateTime.UtcNow;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

// ETA prediction and tracking
public enum EtaSource
{
    Device = 0,
    Eld = 1,
    Manual = 2
}

public class EtaUpdate
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid AppointmentId { get; set; }
    public Appointment? Appointment { get; set; }

    public EtaSource Source { get; set; } = EtaSource.Manual;

    public DateTime Eta { get; set; }

    // Confidence level 0.0-1.0
    public float Confidence { get; set; } = 0.5f;

    // Predicted dwell time in minutes
    public int? DwellPredMinutes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

// Slot scheduling rules
public class SlotRule
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid LocationId { get; set; }

    [MaxLength(100)]
    public string? DockGroup { get; set; } // e.g., "loading", "unloading"

    public int CapacityPerSlot { get; set; } = 1;

    public int SlotMinutes { get; set; } = 60; // Default 1 hour slots

    // JSON time windows (e.g., [{"start": "08:00", "end": "17:00", "days": [1,2,3,4,5]}])
    public string? Windows { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

// Detention and billing policies
public class DetentionPolicy
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid LocationId { get; set; }

    public int FreeMinutes { get; set; } = 120; // 2 hours free

    [Column(TypeName = "decimal(10,2)")]
    public decimal ChargePerHour { get; set; } = 50.00m;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

// Document workflow management (extends existing Document model)
public enum DocumentType
{
    BOL = 0,
    POD = 1,
    Other = 2
}

public class LogisticsDocument
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid AppointmentId { get; set; }
    public Appointment? Appointment { get; set; }

    public DocumentType Type { get; set; } = DocumentType.Other;

    [MaxLength(2048)]
    public string? BlobUrl { get; set; }

    public DateTime? SignedAt { get; set; }

    [MaxLength(100)]
    public string? SignerRole { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

// Event logging and audit trail
public enum EventType
{
    Eta = 0,
    Arrive = 1,
    AtDock = 2,
    Depart = 3,
    DocSigned = 4,
    Exception = 5
}

public class LogisticsEvent
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid LocationId { get; set; }

    public EventType Type { get; set; }

    [MaxLength(100)]
    public string? RefTable { get; set; } // e.g., "appointments", "trailers"

    public Guid? RefId { get; set; }

    // JSON payload for flexible event data
    public string? Payload { get; set; }

    public DateTime At { get; set; } = DateTime.UtcNow;
}

// Exception and alert management
public enum ExceptionCode
{
    Late = 0,
    Early = 1,
    NoShow = 2,
    OverDwell = 3,
    MissingDocs = 4
}

public enum ExceptionSeverity
{
    Info = 0,
    Warning = 1,
    Critical = 2
}

public class Exception
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid AppointmentId { get; set; }
    public Appointment? Appointment { get; set; }

    public ExceptionCode Code { get; set; }

    public ExceptionSeverity Severity { get; set; } = ExceptionSeverity.Warning;

    public DateTime OpenedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ClosedAt { get; set; }

    [MaxLength(1000)]
    public string? Notes { get; set; }
}
