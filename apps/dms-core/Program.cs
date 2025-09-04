using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.EntityFrameworkCore;
using DmsCore.Models;

var builder = WebApplication.CreateBuilder(args);
// CORS for local web app
var corsPolicy = "web-cors";
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicy, policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                "http://web:3000"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "DMS Core API", Version = "v1" });
    // TODO: Document JWT bearer scheme once finalized
});

// TODO: Add EF Core DbContext (Postgres) with row-level security/tenant filters
var connStr = builder.Configuration.GetConnectionString("AppDb")
    ?? builder.Configuration["DB_CONNECTION"]
    ?? "Host=localhost;Port=5432;Database=collabazure;Username=postgres;Password=postgres";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connStr));
// TODO: Add FluentValidation
// TODO: Add OpenTelemetry

// Auth: Validate NextAuth-issued JWT (HS256 for local dev). In prod, prefer asymmetric signing.
var jwtIssuer = builder.Configuration["Auth:Jwt:Issuer"] ?? "collabazure-web";
var jwtAudience = builder.Configuration["Auth:Jwt:Audience"] ?? "collabazure-api";
var jwtSecret = builder.Configuration["Auth:Jwt:Secret"] ?? "please-change-me"; // TODO: Key Vault in prod

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateLifetime = true,
        };
    });
builder.Services.AddAuthorization(options =>
{
    // TODO: Add role policies (Admin, Preparer, Signer, Viewer, Dispatcher, Driver)
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();
app.UseCors(corsPolicy);

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

// Initialize database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    if (!db.ChatChannels.Any())
    {
        db.ChatChannels.AddRange(
            new ChatChannel { Name = "General", Category = "general", CreatedBy = "system@chatdo.com" },
            new ChatChannel { Name = "Inbound", Category = "inbound", CreatedBy = "system@chatdo.com" },
            new ChatChannel { Name = "Outbound", Category = "outbound", CreatedBy = "system@chatdo.com" }
        );
        db.SaveChanges();
    }
}

// User preferences
app.MapGet("/users/me/preferences", async (HttpContext ctx, AppDbContext db) =>
{
    var userId = ctx.User.FindFirst("sub")?.Value ?? "anonymous";
    var pref = await db.UserPreferences.FirstOrDefaultAsync(x => x.UserId == userId);
    if (pref == null)
    {
        pref = new UserPreference { UserId = userId };
        db.UserPreferences.Add(pref);
        await db.SaveChangesAsync();
    }
    return Results.Ok(pref);
}).WithTags("Users").RequireAuthorization();

app.MapPut("/users/me/preferences", async (HttpContext ctx, AppDbContext db) =>
{
    var userId = ctx.User.FindFirst("sub")?.Value ?? "anonymous";
    var body = await ctx.Request.ReadFromJsonAsync<UserPreference>();
    if (body == null) return Results.BadRequest();
    var pref = await db.UserPreferences.FirstOrDefaultAsync(x => x.UserId == userId);
    if (pref == null)
    {
        pref = new UserPreference { UserId = userId };
        db.UserPreferences.Add(pref);
    }
    pref.Language = string.IsNullOrWhiteSpace(body.Language) ? pref.Language : body.Language;
    pref.Status = string.IsNullOrWhiteSpace(body.Status) ? pref.Status : body.Status;
    pref.NotificationsPaused = body.NotificationsPaused;
    await db.SaveChangesAsync();
    return Results.Ok(pref);
}).WithTags("Users").RequireAuthorization();

// Chat: channels
app.MapGet("/chat/channels", async (AppDbContext db) =>
{
    var list = await db.ChatChannels.OrderBy(c => c.Name).ToListAsync();
    return Results.Ok(list);
}).WithTags("Chat").RequireAuthorization();

app.MapPost("/chat/channels", async (ChatChannel input, HttpContext ctx, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(input.Name)) return Results.BadRequest(new { error = "Name required" });
    input.CreatedBy = ctx.User.FindFirst("sub")?.Value ?? "anonymous";
    input.Category = string.IsNullOrWhiteSpace(input.Category) ? "general" : input.Category.ToLowerInvariant();
    db.ChatChannels.Add(input);
    await db.SaveChangesAsync();
    return Results.Created($"/chat/channels/{input.Id}", input);
}).WithTags("Chat").RequireAuthorization();

app.MapPut("/chat/channels/{id}", async (Guid id, ChatChannel patch, AppDbContext db) =>
{
    var chan = await db.ChatChannels.FindAsync(id);
    if (chan == null) return Results.NotFound();
    chan.VehicleNumber = patch.VehicleNumber ?? chan.VehicleNumber;
    chan.DoorNumber = patch.DoorNumber ?? chan.DoorNumber;
    chan.DoorStatus = patch.DoorStatus;
    chan.DocsOk = patch.DocsOk;
    chan.AlarmActive = patch.AlarmActive;
    chan.AuthorizedDoorChangers = patch.AuthorizedDoorChangers ?? chan.AuthorizedDoorChangers;
    await db.SaveChangesAsync();
    return Results.Ok(chan);
}).WithTags("Chat").RequireAuthorization();

// Chat: messages
app.MapGet("/chat/channels/{id}/messages", async (Guid id, int? take, DateTime? before, AppDbContext db) =>
{
    var q = db.ChatMessages.Where(m => m.ChannelId == id);
    if (before.HasValue) q = q.Where(m => m.CreatedAt < before.Value);
    var size = Math.Clamp(take ?? 50, 1, 200);
    var list = await q.OrderByDescending(m => m.CreatedAt).Take(size).OrderBy(m => m.CreatedAt).ToListAsync();
    return Results.Ok(list);
}).WithTags("Chat").RequireAuthorization();

app.MapPost("/chat/channels/{id}/messages", async (Guid id, ChatMessage input, HttpContext ctx, AppDbContext db) =>
{
    var chan = await db.ChatChannels.FindAsync(id);
    if (chan == null) return Results.NotFound(new { error = "Channel not found" });
    var userId = ctx.User.FindFirst("sub")?.Value ?? "anonymous";
    var msg = new ChatMessage
    {
        ChannelId = id,
        AuthorId = userId,
        Body = input.Body,
        Lang = string.IsNullOrWhiteSpace(input.Lang) ? null : input.Lang,
        CreatedAt = DateTime.UtcNow
    };
    db.ChatMessages.Add(msg);
    await db.SaveChangesAsync();
    return Results.Created($"/chat/channels/{id}/messages/{msg.Id}", msg);
}).WithTags("Chat").RequireAuthorization();

// Documents
app.MapGet("/documents", async (HttpContext context, AppDbContext db) =>
{
    var userId = context.User.FindFirst("sub")?.Value ?? "anonymous";
    var documents = await db.Documents.Where(d => d.UploadedBy == userId)
        .OrderByDescending(d => d.UploadedAt).ToListAsync();
    return Results.Ok(new { documents });
})
.WithTags("Documents")
.RequireAuthorization();

app.MapPost("/documents", async (HttpContext context, AppDbContext db) =>
{
    var form = await context.Request.ReadFormAsync();
    var file = form.Files.FirstOrDefault();
    
    if (file == null || file.Length == 0)
        return Results.BadRequest(new { error = "No file uploaded" });
    
    var userId = context.User.FindFirst("sub")?.Value ?? "anonymous";
    var documentId = Guid.NewGuid().ToString();
    
    var document = new Document
    {
        Id = Guid.Parse(documentId),
        FileName = file.FileName,
        ContentType = file.ContentType,
        Size = file.Length,
        UploadedBy = userId,
        UploadedAt = DateTime.UtcNow,
        Status = "uploaded"
    };

    // TODO: Store file bytes to blob storage; here we only persist metadata
    db.Documents.Add(document);
    await db.SaveChangesAsync();

    return Results.Created($"/documents/{documentId}", document);
})
.WithTags("Documents")
.RequireAuthorization()
.DisableAntiforgery();

app.MapGet("/documents/{id}", async (string id, HttpContext context, AppDbContext db) =>
{
    var userId = context.User.FindFirst("sub")?.Value ?? "anonymous";
    if (!Guid.TryParse(id, out var gid)) return Results.BadRequest(new { error = "Invalid id" });
    var document = await db.Documents.FirstOrDefaultAsync(d => d.Id == gid && d.UploadedBy == userId);
    
    if (document == null)
        return Results.NotFound(new { error = "Document not found" });
    
    return Results.Ok(document);
})
.WithTags("Documents")
.RequireAuthorization();

app.MapDelete("/documents/{id}", async (string id, HttpContext context, AppDbContext db) =>
{
    var userId = context.User.FindFirst("sub")?.Value ?? "anonymous";
    if (!Guid.TryParse(id, out var gid)) return Results.BadRequest(new { error = "Invalid id" });
    var entity = await db.Documents.FirstOrDefaultAsync(d => d.Id == gid && d.UploadedBy == userId);
    if (entity == null) return Results.NotFound(new { error = "Document not found" });
    db.Documents.Remove(entity);
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.WithTags("Documents")
.RequireAuthorization();

// Envelopes (E-Sign)
app.MapPost("/envelopes", async (HttpContext context, AppDbContext db) =>
{
    var body = await context.Request.ReadFromJsonAsync<CreateEnvelopeRequest>();
    if (body == null)
        return Results.BadRequest(new { error = "Invalid envelope data" });
    
    var userId = context.User.FindFirst("sub")?.Value ?? "anonymous";
    var envelopeId = Guid.NewGuid().ToString();
    
    var envelope = new Envelope
    {
        Id = Guid.Parse(envelopeId),
        DocumentId = Guid.Parse(body.DocumentId),
        SignersJson = System.Text.Json.JsonSerializer.Serialize(body.Signers ?? Array.Empty<string>()),
        Status = "created",
        CreatedBy = userId,
        CreatedAt = DateTime.UtcNow,
        ExpiresAt = DateTime.UtcNow.AddDays(30)
    };
    db.Envelopes.Add(envelope);
    await db.SaveChangesAsync();

    return Results.Created($"/envelopes/{envelopeId}", envelope);
})
.WithTags("Envelopes")
.RequireAuthorization();

app.MapPost("/envelopes/{id}/finalize", async (string id, HttpContext context, AppDbContext db) =>
{
    var userId = context.User.FindFirst("sub")?.Value ?? "anonymous";
    if (!Guid.TryParse(id, out var gid)) return Results.BadRequest(new { error = "Invalid id" });
    var env = await db.Envelopes.FirstOrDefaultAsync(e => e.Id == gid && e.CreatedBy == userId);
    if (env == null) return Results.NotFound(new { error = "Envelope not found" });
    env.Status = "finalized";
    await db.SaveChangesAsync();
    return Results.Ok(new { message = "Envelope finalized", id });
})
.WithTags("Envelopes")
.RequireAuthorization();

app.MapGet("/envelopes/{id}", async (string id, HttpContext context, AppDbContext db) =>
{
    if (!Guid.TryParse(id, out var gid)) return Results.BadRequest(new { error = "Invalid id" });
    var envelope = await db.Envelopes.FirstOrDefaultAsync(e => e.Id == gid);
    if (envelope == null)
        return Results.NotFound(new { error = "Envelope not found" });
    
    return Results.Ok(envelope);
})
.WithTags("Envelopes")
.RequireAuthorization();

app.MapPost("/envelopes/{id}/sign", async (string id, HttpContext context, AppDbContext db) =>
{
    var body = await context.Request.ReadFromJsonAsync<SignRequest>();
    if (body == null)
        return Results.BadRequest(new { error = "Invalid signature data" });
    
    var userId = context.User.FindFirst("sub")?.Value ?? "anonymous";
    if (!Guid.TryParse(id, out var gid)) return Results.BadRequest(new { error = "Invalid id" });
    var env = await db.Envelopes.FirstOrDefaultAsync(e => e.Id == gid);
    if (env == null) return Results.NotFound(new { error = "Envelope not found" });
    // Note: Just setting status for demo; real implementation should attach signature blob
    env.Status = "signed";
    await db.SaveChangesAsync();
    return Results.Ok(new { message = "Document signed successfully" });
})
.WithTags("Envelopes")
.RequireAuthorization();

// Compare (OS&S)
app.MapPost("/compare", (Osns.CompareRequest req) =>
{
    var result = Osns.Engine.Compare(req);
    return Results.Json(result);
})
    .WithTags("OS&S");

// Geofence check-in
app.MapPost("/geofence/check-in", async (HttpContext context) =>
{
    var body = await context.Request.ReadFromJsonAsync<GeofenceCheckInRequest>();
    if (body == null)
        return Results.BadRequest(new { error = "Invalid check-in data" });
    
    var userId = context.User.FindFirst("sub")?.Value ?? "anonymous";
    var result = await ProcessGeofenceCheckIn(userId, body.Latitude, body.Longitude, body.GeofenceId);
    
    return Results.Ok(result);
})
.WithTags("Geofence")
.RequireAuthorization();

// Mobile to backend geofence event (no Azure Functions)
app.MapPost("/geofence/events", async (HttpContext context) =>
{
    var body = await context.Request.ReadFromJsonAsync<GeofenceEventRequest>();
    if (body == null)
        return Results.BadRequest(new { error = "Invalid event data" });
    
    var userId = context.User.FindFirst("sub")?.Value ?? "anonymous";
    await ProcessGeofenceEvent(userId, body);
    
    return Results.Accepted();
})
.WithTags("Geofence")
.RequireAuthorization();

app.MapGet("/geofence/zones", async (HttpContext context) =>
{
    var userId = context.User.FindFirst("sub")?.Value ?? "anonymous";
    var zones = await GetUserGeofenceZones(userId);
    return Results.Ok(new { zones });
})
.WithTags("Geofence")
.RequireAuthorization();

// Inbound events (Service Bus webhook)
app.MapPost("/events/inbound", () => Results.StatusCode(501))
    .WithTags("Events");

app.Run();

// Helper methods for geofencing
static async Task<object> ProcessGeofenceCheckIn(string userId, double lat, double lng, string geofenceId)
{
    // TODO: Check if location is within geofence boundaries
    var distance = CalculateDistance(lat, lng, geofenceId);
    var isInside = distance <= 100; // 100 meter radius
    
    var result = new
    {
        userId,
        geofenceId,
        latitude = lat,
        longitude = lng,
        isInside,
        distance,
        timestamp = DateTime.UtcNow,
        message = isInside ? "Check-in successful" : "Outside geofence boundary"
    };
    
    await Task.Delay(50); // Simulate processing
    Console.WriteLine($"Geofence check-in: {result}");
    return result;
}

static async Task ProcessGeofenceEvent(string userId, GeofenceEventRequest eventData)
{
    // TODO: Process geofence events (enter, exit, dwell)
    await Task.Delay(100);
    Console.WriteLine($"Processing geofence event: {eventData.EventType} for user {userId}");
}

static async Task<List<object>> GetUserGeofenceZones(string userId)
{
    // TODO: Get from database
    await Task.Delay(10);
    return new List<object>
    {
        new { id = "zone1", name = "Warehouse A", latitude = 37.7749, longitude = -122.4194, radius = 100 },
        new { id = "zone2", name = "Customer Site", latitude = 37.7849, longitude = -122.4094, radius = 50 }
    };
}

static double CalculateDistance(double lat, double lng, string geofenceId)
{
    // TODO: Calculate actual distance to geofence center
    // Mock calculation for now
    return new Random().NextDouble() * 200; // Random distance 0-200 meters
}

// Request models
public record CreateEnvelopeRequest(string DocumentId, string[] Signers);
public record SignRequest(string Signature, string SignatureType);
public record GeofenceCheckInRequest(double Latitude, double Longitude, string GeofenceId);
public record GeofenceEventRequest(string EventType, double Latitude, double Longitude, string? GeofenceId, DateTime Timestamp);
