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
var connStr = builder.Configuration.GetConnectionString("Postgres")
    ?? builder.Configuration.GetConnectionString("AppDb")
    ?? builder.Configuration["DB_CONNECTION"]
    ?? "Host=postgres;Port=5432;Database=collab;Username=collab;Password=collab";
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
        MessageType = string.IsNullOrWhiteSpace(input.MessageType) ? "text" : input.MessageType,
        DocumentId = input.DocumentId,
        ReplyToMessageId = input.ReplyToMessageId,
        CreatedAt = DateTime.UtcNow
    };
    db.ChatMessages.Add(msg);
    await db.SaveChangesAsync();
    return Results.Created($"/chat/channels/{id}/messages/{msg.Id}", msg);
}).WithTags("Chat").RequireAuthorization();

// Chat: hide message (soft-hide per user)
app.MapPost("/chat/messages/{messageId}/hide", async (Guid messageId, HttpContext ctx, AppDbContext db) =>
{
    var userId = ctx.User.FindFirst("sub")?.Value ?? "anonymous";
    var msg = await db.ChatMessages.FindAsync(messageId);
    if (msg == null) return Results.NotFound(new { error = "Message not found" });
    var already = await db.Set<HiddenMessage>().FirstOrDefaultAsync(h => h.MessageId == messageId && h.UserId == userId);
    if (already != null) return Results.Ok(already);
    var hidden = new HiddenMessage { MessageId = messageId, UserId = userId };
    db.Add(hidden);
    await db.SaveChangesAsync();
    return Results.Ok(hidden);
}).WithTags("Chat").RequireAuthorization();

// Chat: update delivery/read status (WhatsApp-like)
app.MapPost("/chat/messages/{messageId}/status", async (Guid messageId, string status, HttpContext ctx, AppDbContext db) =>
{
    var msg = await db.ChatMessages.FindAsync(messageId);
    if (msg == null) return Results.NotFound(new { error = "Message not found" });
    var allowed = new[] { "sent", "delivered", "read" };
    if (!allowed.Contains(status)) return Results.BadRequest(new { error = "Invalid status" });
    msg.Status = status;
    await db.SaveChangesAsync();
    return Results.Ok(new { id = msg.Id, status = msg.Status });
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
    db.DocumentAudits.Add(new DocumentAudit { DocumentId = document.Id, Action = "uploaded", ActorId = userId });
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
    db.DocumentAudits.Add(new DocumentAudit { DocumentId = document.Id, Action = "viewed", ActorId = userId });
    await db.SaveChangesAsync();
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
    db.DocumentAudits.Add(new DocumentAudit { DocumentId = entity.Id, Action = "deleted", ActorId = userId });
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
    Provider = string.IsNullOrWhiteSpace(body.Provider) ? "local" : body.Provider.ToLowerInvariant(),
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
    db.SignatureEvents.Add(new SignatureEvent { EnvelopeId = env.Id, EventType = "signed", PayloadJson = null });
    await db.SaveChangesAsync();
    return Results.Ok(new { message = "Document signed successfully" });
})
.WithTags("Envelopes")
.RequireAuthorization();

// Envelopes: provider webhook callback (agnostic)
app.MapPost("/envelopes/{id}/callback", async (string id, HttpContext context, AppDbContext db) =>
{
    var bodyText = await new StreamReader(context.Request.Body).ReadToEndAsync();
    var signature = context.Request.Headers["X-Signature"].ToString();
    if (!Guid.TryParse(id, out var gid)) return Results.BadRequest(new { error = "Invalid id" });
    var env = await db.Envelopes.FirstOrDefaultAsync(e => e.Id == gid);
    if (env == null) return Results.NotFound(new { error = "Envelope not found" });
    // Minimal persistence of callback for audit
    db.SignatureEvents.Add(new SignatureEvent { EnvelopeId = env.Id, EventType = "callback", PayloadJson = bodyText });
    await db.SaveChangesAsync();
    return Results.Ok(new { status = "received" });
}).WithTags("Envelopes");

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

// C3-Hive API Endpoints

// Locations Management
app.MapGet("/api/locations", async (HttpContext context, AppDbContext db) =>
{
    var orgId = context.User.FindFirst("org_id")?.Value;
    if (string.IsNullOrEmpty(orgId)) return Results.BadRequest(new { error = "Organization ID required" });
    
    var locations = await db.Locations
        .Where(l => l.OrgId == Guid.Parse(orgId))
        .ToListAsync();
    
    return Results.Ok(locations);
})
.WithTags("Locations")
.RequireAuthorization();

app.MapPost("/api/locations", async (HttpContext context, AppDbContext db) =>
{
    var body = await context.Request.ReadFromJsonAsync<CreateLocationRequest>();
    if (body == null) return Results.BadRequest(new { error = "Invalid location data" });
    
    var userId = context.User.FindFirst("sub")?.Value ?? "anonymous";
    var orgId = context.User.FindFirst("org_id")?.Value;
    if (string.IsNullOrEmpty(orgId)) return Results.BadRequest(new { error = "Organization ID required" });
    
    var location = new Location
    {
        OrgId = Guid.Parse(orgId),
        Name = body.Name,
        TimeZone = body.TimeZone ?? "UTC",
        Address = body.Address,
        GeojsonGate = body.GeojsonGate,
        GeojsonYard = body.GeojsonYard
    };
    
    db.Locations.Add(location);
    await db.SaveChangesAsync();
    
    return Results.Created($"/api/locations/{location.Id}", location);
})
.WithTags("Locations")
.RequireAuthorization();

// Appointments Management
app.MapGet("/api/appointments", async (HttpContext context, AppDbContext db) =>
{
    var locationId = context.Request.Query["location_id"].ToString();
    var status = context.Request.Query["status"].ToString();
    
    var query = db.Appointments.AsQueryable();
    
    if (!string.IsNullOrEmpty(locationId) && Guid.TryParse(locationId, out var locId))
        query = query.Where(a => a.LocationId == locId);
    
    if (!string.IsNullOrEmpty(status) && Enum.TryParse<AppointmentStatus>(status, out var statusEnum))
        query = query.Where(a => a.Status == statusEnum);
    
    var appointments = await query
        .OrderBy(a => a.WindowStart)
        .Take(100)
        .ToListAsync();
    
    return Results.Ok(appointments);
})
.WithTags("Appointments")
.RequireAuthorization();

app.MapPost("/api/appointments", async (HttpContext context, AppDbContext db) =>
{
    var body = await context.Request.ReadFromJsonAsync<CreateAppointmentRequest>();
    if (body == null) return Results.BadRequest(new { error = "Invalid appointment data" });
    
    var userId = context.User.FindFirst("sub")?.Value ?? "anonymous";
    
    var appointment = new Appointment
    {
        LocationId = body.LocationId,
        CarrierId = body.CarrierId,
        Po = body.Po,
        RefNo = body.RefNo,
        WindowStart = body.WindowStart,
        WindowEnd = body.WindowEnd,
        Priority = body.Priority,
        CreatedBy = userId
    };
    
    db.Appointments.Add(appointment);
    await db.SaveChangesAsync();
    
    return Results.Created($"/api/appointments/{appointment.Id}", appointment);
})
.WithTags("Appointments")
.RequireAuthorization();

// ETA Updates
app.MapGet("/api/appointments/{appointmentId}/eta", async (string appointmentId, AppDbContext db) =>
{
    if (!Guid.TryParse(appointmentId, out var id)) 
        return Results.BadRequest(new { error = "Invalid appointment ID" });
    
    var latestEta = await db.EtaUpdates
        .Where(e => e.AppointmentId == id)
        .OrderByDescending(e => e.CreatedAt)
        .FirstOrDefaultAsync();
    
    if (latestEta == null) 
        return Results.NotFound(new { error = "No ETA found" });
    
    return Results.Ok(latestEta);
})
.WithTags("ETA")
.RequireAuthorization();

app.MapPost("/api/appointments/{appointmentId}/eta", async (string appointmentId, HttpContext context, AppDbContext db) =>
{
    if (!Guid.TryParse(appointmentId, out var id)) 
        return Results.BadRequest(new { error = "Invalid appointment ID" });
    
    var body = await context.Request.ReadFromJsonAsync<CreateEtaUpdateRequest>();
    if (body == null) return Results.BadRequest(new { error = "Invalid ETA data" });
    
    var appointment = await db.Appointments.FindAsync(id);
    if (appointment == null) return Results.NotFound(new { error = "Appointment not found" });
    
    var etaUpdate = new EtaUpdate
    {
        AppointmentId = id,
        Source = body.Source,
        Eta = body.Eta,
        Confidence = body.Confidence,
        DwellPredMinutes = body.DwellPredMinutes
    };
    
    db.EtaUpdates.Add(etaUpdate);
    await db.SaveChangesAsync();
    
    return Results.Created($"/api/appointments/{appointmentId}/eta/{etaUpdate.Id}", etaUpdate);
})
.WithTags("ETA")
.RequireAuthorization();

// Trailers Management
app.MapGet("/api/trailers", async (HttpContext context, AppDbContext db) =>
{
    var carrierId = context.Request.Query["carrier_id"].ToString();
    var status = context.Request.Query["status"].ToString();
    
    var query = db.Trailers.AsQueryable();
    
    if (!string.IsNullOrEmpty(carrierId) && Guid.TryParse(carrierId, out var carId))
        query = query.Where(t => t.CarrierId == carId);
    
    if (!string.IsNullOrEmpty(status) && Enum.TryParse<TrailerStatus>(status, out var statusEnum))
        query = query.Where(t => t.Status == statusEnum);
    
    var trailers = await query
        .OrderByDescending(t => t.LastSeen)
        .Take(100)
        .ToListAsync();
    
    return Results.Ok(trailers);
})
.WithTags("Trailers")
.RequireAuthorization();

app.MapPost("/api/trailers", async (HttpContext context, AppDbContext db) =>
{
    var body = await context.Request.ReadFromJsonAsync<CreateTrailerRequest>();
    if (body == null) return Results.BadRequest(new { error = "Invalid trailer data" });
    
    var trailer = new Trailer
    {
        CarrierId = body.CarrierId,
        EquipmentType = body.EquipmentType,
        Plate = body.Plate
    };
    
    db.Trailers.Add(trailer);
    await db.SaveChangesAsync();
    
    return Results.Created($"/api/trailers/{trailer.Id}", trailer);
})
.WithTags("Trailers")
.RequireAuthorization();

// Integration endpoint for service events
app.MapPost("/events/inbound", async (HttpContext context, AppDbContext db) =>
{
    var body = await context.Request.ReadFromJsonAsync<InboundEventRequest>();
    if (body == null) return Results.BadRequest(new { error = "Invalid event data" });
    
    // Log the event
    var logEvent = new LogisticsEvent
    {
        LocationId = body.LocationId,
        Type = body.Type,
        RefTable = body.RefTable,
        RefId = body.RefId,
        Payload = body.Payload
    };
    
    db.LogisticsEvents.Add(logEvent);
    await db.SaveChangesAsync();
    
    // Forward to real-time chat if needed
    if (body.Type == EventType.Exception || body.Type == EventType.Eta)
    {
        // TODO: Send to chat service for real-time notifications
        Console.WriteLine($"Event notification: {body.Type} - {body.Payload}");
    }
    
    return Results.Ok(new { status = "received", event_id = logEvent.Id });
})
.WithTags("Events");

// Authentication Endpoints
app.MapPost("/auth/register", async (RegisterRequest request, AppDbContext db) =>
{
    // Validate password confirmation
    if (request.Password != request.ConfirmPassword)
        return Results.BadRequest(new { error = "Passwords do not match" });

    // Check if user already exists
    var existingUser = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
    if (existingUser != null)
        return Results.BadRequest(new { error = "User with this email already exists" });

    // Hash password
    var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

    // Create user
    var user = new User
    {
        Email = request.Email,
        FirstName = request.FirstName,
        LastName = request.LastName,
        Company = request.Company,
        Phone = request.Phone,
        PasswordHash = passwordHash,
        Roles = new[] { "User" }
    };

    db.Users.Add(user);
    await db.SaveChangesAsync();

    // Generate JWT token
    var token = GenerateJwtToken(user);

    return Results.Ok(new AuthResponse
    {
        Token = token,
        User = new UserInfo
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Company = user.Company,
            Phone = user.Phone,
            TenantId = user.TenantId,
            FacilityId = user.FacilityId,
            Roles = user.Roles,
            CreatedAt = user.CreatedAt,
            LastLoginAt = user.LastLoginAt
        },
        ExpiresAt = DateTime.UtcNow.AddDays(7)
    });
})
.WithTags("Auth");

app.MapPost("/auth/login", async (LoginRequest request, AppDbContext db) =>
{
    // Find user by email
    var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);
    if (user == null)
        return Results.BadRequest(new { error = "Invalid email or password" });

    // Verify password
    if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        return Results.BadRequest(new { error = "Invalid email or password" });

    // Update last login
    user.LastLoginAt = DateTime.UtcNow;
    await db.SaveChangesAsync();

    // Generate JWT token
    var token = GenerateJwtToken(user);

    return Results.Ok(new AuthResponse
    {
        Token = token,
        User = new UserInfo
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Company = user.Company,
            Phone = user.Phone,
            TenantId = user.TenantId,
            FacilityId = user.FacilityId,
            Roles = user.Roles,
            CreatedAt = user.CreatedAt,
            LastLoginAt = user.LastLoginAt
        },
        ExpiresAt = DateTime.UtcNow.AddDays(7)
    });
})
.WithTags("Auth");

app.MapPost("/auth/social", async (SocialLoginRequest request, AppDbContext db) =>
{
    // For now, we'll create a simple social login that doesn't verify the token
    // In production, you should verify the ID token with the respective provider
    
    var user = await db.Users.FirstOrDefaultAsync(u => 
        (request.Provider == "google" && u.GoogleId == request.IdToken) ||
        (request.Provider == "apple" && u.AppleId == request.IdToken) ||
        (request.Provider == "microsoft" && u.MicrosoftId == request.IdToken));

    if (user == null)
    {
        // Create new user for social login
        user = new User
        {
            Email = request.Email ?? $"{request.Provider}@{request.Provider}.com",
            FirstName = request.FirstName ?? "User",
            LastName = request.LastName ?? "",
            Company = request.Company,
            Roles = new[] { "User" }
        };

        // Set the appropriate social ID
        switch (request.Provider)
        {
            case "google":
                user.GoogleId = request.IdToken;
                break;
            case "apple":
                user.AppleId = request.IdToken;
                break;
            case "microsoft":
                user.MicrosoftId = request.IdToken;
                break;
        }

        db.Users.Add(user);
        await db.SaveChangesAsync();
    }

    // Update last login
    user.LastLoginAt = DateTime.UtcNow;
    await db.SaveChangesAsync();

    // Generate JWT token
    var token = GenerateJwtToken(user);

    return Results.Ok(new AuthResponse
    {
        Token = token,
        User = new UserInfo
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Company = user.Company,
            Phone = user.Phone,
            TenantId = user.TenantId,
            FacilityId = user.FacilityId,
            Roles = user.Roles,
            CreatedAt = user.CreatedAt,
            LastLoginAt = user.LastLoginAt
        },
        ExpiresAt = DateTime.UtcNow.AddDays(7)
    });
})
.WithTags("Auth");

app.Run();

// Helper function to generate JWT token
static string GenerateJwtToken(User user)
{
    var jwtIssuer = "collabazure-web";
    var jwtAudience = "collabazure-api";
    var jwtSecret = "please-change-me"; // TODO: Use proper secret from configuration
    
    var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
    var key = Encoding.UTF8.GetBytes(jwtSecret);
    
    var tokenDescriptor = new Microsoft.IdentityModel.Tokens.SecurityTokenDescriptor
    {
        Subject = new System.Security.Claims.ClaimsIdentity(new[]
        {
            new System.Security.Claims.Claim("sub", user.Id.ToString()),
            new System.Security.Claims.Claim("email", user.Email),
            new System.Security.Claims.Claim("name", $"{user.FirstName} {user.LastName}"),
            new System.Security.Claims.Claim("tenant_id", user.TenantId?.ToString() ?? ""),
            new System.Security.Claims.Claim("facility_id", user.FacilityId?.ToString() ?? ""),
            new System.Security.Claims.Claim("roles", string.Join(",", user.Roles))
        }),
        Expires = DateTime.UtcNow.AddDays(7),
        Issuer = jwtIssuer,
        Audience = jwtAudience,
        SigningCredentials = new Microsoft.IdentityModel.Tokens.SigningCredentials(
            new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(key),
            Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256Signature)
    };
    
    var token = tokenHandler.CreateToken(tokenDescriptor);
    return tokenHandler.WriteToken(token);
}

// Request models for C3-Hive endpoints
public record CreateLocationRequest(string Name, string? TimeZone, string? Address, string? GeojsonGate, string? GeojsonYard);
public record CreateAppointmentRequest(Guid LocationId, Guid CarrierId, string? Po, string? RefNo, DateTime WindowStart, DateTime WindowEnd, int Priority);
public record CreateEtaUpdateRequest(EtaSource Source, DateTime Eta, float Confidence, int? DwellPredMinutes);
public record CreateTrailerRequest(Guid CarrierId, EquipmentType EquipmentType, string Plate);
public record InboundEventRequest(Guid LocationId, EventType Type, string? RefTable, Guid? RefId, string? Payload);

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
public record CreateEnvelopeRequest(string DocumentId, string[] Signers, string? Provider);
public record SignRequest(string Signature, string SignatureType);
public record GeofenceCheckInRequest(double Latitude, double Longitude, string GeofenceId);
public record GeofenceEventRequest(string EventType, double Latitude, double Longitude, string? GeofenceId, DateTime Timestamp);
