using Microsoft.EntityFrameworkCore;
using DmsCore.Models;

namespace DmsCore.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<ChatChannel> ChatChannels => Set<ChatChannel>();
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
    public DbSet<ChannelMember> ChannelMembers => Set<ChannelMember>();
    public DbSet<UserPreference> UserPreferences => Set<UserPreference>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<Envelope> Envelopes => Set<Envelope>();
    public DbSet<DocumentAudit> DocumentAudits => Set<DocumentAudit>();
    public DbSet<SignatureEvent> SignatureEvents => Set<SignatureEvent>();
    public DbSet<HiddenMessage> HiddenMessages => Set<HiddenMessage>();

    // C3-Hive Logistics Models
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<Dock> Docks => Set<Dock>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<CheckIn> CheckIns => Set<CheckIn>();
    public DbSet<Trailer> Trailers => Set<Trailer>();
    public DbSet<EtaUpdate> EtaUpdates => Set<EtaUpdate>();
    public DbSet<SlotRule> SlotRules => Set<SlotRule>();
    public DbSet<DetentionPolicy> DetentionPolicies => Set<DetentionPolicy>();
    public DbSet<LogisticsDocument> LogisticsDocuments => Set<LogisticsDocument>();
    public DbSet<LogisticsEvent> LogisticsEvents => Set<LogisticsEvent>();
    public DbSet<Exception> Exceptions => Set<Exception>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ChatChannel>()
            .HasIndex(c => c.Name);

        modelBuilder.Entity<ChatMessage>()
            .HasIndex(m => new { m.ChannelId, m.CreatedAt });

        modelBuilder.Entity<UserPreference>()
            .HasIndex(u => u.UserId)
            .IsUnique();

        modelBuilder.Entity<Document>()
            .HasIndex(d => new { d.UploadedBy, d.UploadedAt });

        modelBuilder.Entity<DocumentAudit>()
            .HasIndex(d => new { d.DocumentId, d.At });

        modelBuilder.Entity<Envelope>()
            .HasIndex(e => new { e.DocumentId, e.Provider, e.Status });

        modelBuilder.Entity<SignatureEvent>()
            .HasIndex(s => new { s.EnvelopeId, s.At });

        modelBuilder.Entity<HiddenMessage>()
            .HasIndex(h => new { h.UserId, h.MessageId })
            .IsUnique();

        // C3-Hive Logistics Indices and Relationships
        modelBuilder.Entity<Location>()
            .HasIndex(l => new { l.OrgId, l.Name });

        modelBuilder.Entity<Dock>()
            .HasIndex(d => new { d.LocationId, d.DoorNo })
            .IsUnique();

        modelBuilder.Entity<Appointment>()
            .HasIndex(a => new { a.LocationId, a.WindowStart, a.WindowEnd });

        modelBuilder.Entity<Appointment>()
            .HasIndex(a => new { a.CarrierId, a.Status });

        modelBuilder.Entity<CheckIn>()
            .HasIndex(c => new { c.AppointmentId, c.At });

        modelBuilder.Entity<Trailer>()
            .HasIndex(t => new { t.CarrierId, t.Status });

        modelBuilder.Entity<EtaUpdate>()
            .HasIndex(e => new { e.AppointmentId, e.CreatedAt });

        modelBuilder.Entity<LogisticsEvent>()
            .HasIndex(e => new { e.LocationId, e.Type, e.At });

        modelBuilder.Entity<Exception>()
            .HasIndex(ex => new { ex.AppointmentId, ex.Code, ex.OpenedAt });

        // Foreign Key Relationships
        modelBuilder.Entity<Dock>()
            .HasOne(d => d.Location)
            .WithMany(l => l.Docks)
            .HasForeignKey(d => d.LocationId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Location)
            .WithMany(l => l.Appointments)
            .HasForeignKey(a => a.LocationId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Dock)
            .WithMany(d => d.Appointments)
            .HasForeignKey(a => a.DockId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<CheckIn>()
            .HasOne(c => c.Appointment)
            .WithMany(a => a.CheckIns)
            .HasForeignKey(c => c.AppointmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<EtaUpdate>()
            .HasOne(e => e.Appointment)
            .WithMany(a => a.EtaUpdates)
            .HasForeignKey(e => e.AppointmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<LogisticsDocument>()
            .HasOne(ld => ld.Appointment)
            .WithMany(a => a.LogisticsDocuments)
            .HasForeignKey(ld => ld.AppointmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Exception>()
            .HasOne(ex => ex.Appointment)
            .WithMany(a => a.Exceptions)
            .HasForeignKey(ex => ex.AppointmentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
