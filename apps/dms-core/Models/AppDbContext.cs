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
    }
}
