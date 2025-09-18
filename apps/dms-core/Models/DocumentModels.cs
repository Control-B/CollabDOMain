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

	// Where the file bytes are stored (blob url, s3 uri, etc.)
	[MaxLength(2048)]
	public string? StorageUrl { get; set; }

	// Optional checksum for integrity verification
	[MaxLength(128)]
	public string? Sha256 { get; set; }

	[Required]
	[MaxLength(200)]
	public string UploadedBy { get; set; } = string.Empty;

	public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

	public DateTime? UpdatedAt { get; set; }

	[MaxLength(40)]
	public string Status { get; set; } = "uploaded";
}

public class DocumentAudit
{
	[Key]
	public Guid Id { get; set; } = Guid.NewGuid();

	[Required]
	public Guid DocumentId { get; set; }

	[Required]
	[MaxLength(64)]
	public string Action { get; set; } = string.Empty; // uploaded, viewed, signed, deleted

	[Required]
	[MaxLength(200)]
	public string ActorId { get; set; } = string.Empty;

	public DateTime At { get; set; } = DateTime.UtcNow;

	[MaxLength(1024)]
	public string? MetadataJson { get; set; }
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

	// Provider integration scaffolding
	[MaxLength(40)]
	public string Provider { get; set; } = "local"; // local | docusign | hellosign

	[MaxLength(256)]
	public string? ProviderEnvelopeId { get; set; }

	[MaxLength(512)]
	public string? CallbackSecret { get; set; }

	[Required]
	[MaxLength(200)]
	public string CreatedBy { get; set; } = string.Empty;

	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	public DateTime? ExpiresAt { get; set; }
}
