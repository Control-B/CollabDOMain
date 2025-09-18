using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace DmsCore.Models;

public class SignatureEvent
{
	[Key]
	public Guid Id { get; set; } = Guid.NewGuid();

	[Required]
	public Guid EnvelopeId { get; set; }

	[MaxLength(64)]
	public string EventType { get; set; } = string.Empty; // created, delivered, signed, completed, declined, voided

	public DateTime At { get; set; } = DateTime.UtcNow;

	[MaxLength(1024)]
	public string? PayloadJson { get; set; }
}

public record ProviderCallbackRequest(string Provider, string Signature, string? Body);

public interface ISignatureProvider
{
	string Name { get; }
	Task<(bool ok, string? providerEnvelopeId, string? error)> CreateEnvelopeAsync(Envelope envelope, Document document, CancellationToken ct = default);
	Task<bool> VerifyCallbackAsync(string signature, string body, string secret);
}

// TODO: Implement DocuSign/HelloSign providers in separate classes/files when credentials are available.
