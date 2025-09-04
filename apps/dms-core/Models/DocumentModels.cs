using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DmsCore.Models;

public class Document
{
	[Key]
	public Guid Id { get; set; } = Guid.NewGuid();

	[Required]
	[MaxLength(256)]
	public string FileName { get; set; } = string.Empty;

	[MaxLength(128)]
	public string? ContentType { get; set; }

	public long Size { get; set; }

	[Required]
	[MaxLength(200)]
	public string UploadedBy { get; set; } = string.Empty;

	public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

	[MaxLength(40)]
	public string Status { get; set; } = "uploaded";
}

public class Envelope
{
	[Key]
	public Guid Id { get; set; } = Guid.NewGuid();

	[Required]
	public Guid DocumentId { get; set; }

	// Simple JSON string of signers for now
	public string SignersJson { get; set; } = "[]";

	[MaxLength(40)]
	public string Status { get; set; } = "created";

	[Required]
	[MaxLength(200)]
	public string CreatedBy { get; set; } = string.Empty;

	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	public DateTime? ExpiresAt { get; set; }
}
