using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DmsCore.Models;

public enum DoorStatus
{
    Green = 0,
    Red = 1
}

public class ChatChannel
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = "General"; // General, Inbound, Outbound, or specific

    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = "general"; // general | inbound | outbound | other

    [MaxLength(50)]
    public string? VehicleNumber { get; set; }

    [MaxLength(50)]
    public string? DoorNumber { get; set; }

    [Required]
    [MaxLength(200)]
    public string CreatedBy { get; set; } = string.Empty; // email/userId

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DoorStatus DoorStatus { get; set; } = DoorStatus.Green;
    public bool DocsOk { get; set; } = false;
    public bool AlarmActive { get; set; } = false;

    // Stored as delimited string for simplicity (email1;email2;...)
    [MaxLength(4000)]
    public string AuthorizedDoorChangers { get; set; } = string.Empty;

    public ICollection<ChatMessage> Messages { get; set; } = new List<ChatMessage>();
}

public class ChatMessage
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid ChannelId { get; set; }
    public ChatChannel? Channel { get; set; }

    [Required]
    [MaxLength(200)]
    public string AuthorId { get; set; } = string.Empty; // email/userId

    [Required]
    [MaxLength(8192)]
    public string Body { get; set; } = string.Empty; // original text

    [MaxLength(8)]
    public string? Lang { get; set; } // e.g., en, es, fr, ...

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class ChannelMember
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid ChannelId { get; set; }

    [Required]
    [MaxLength(200)]
    public string UserId { get; set; } = string.Empty;

    public bool Online { get; set; } = false;
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}

public class UserPreference
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(200)]
    public string UserId { get; set; } = string.Empty;

    [MaxLength(8)]
    public string Language { get; set; } = "en";

    [MaxLength(40)]
    public string Status { get; set; } = "Active"; // Active, Away, Lunch Break, etc.

    public bool NotificationsPaused { get; set; } = false;
}
