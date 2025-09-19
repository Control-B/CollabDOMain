using System.ComponentModel.DataAnnotations;

namespace DmsCore.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    public string LastName { get; set; } = string.Empty;
    
    public string? Company { get; set; }
    
    public string? Phone { get; set; }
    
    [Required]
    public string PasswordHash { get; set; } = string.Empty;
    
    public string? GoogleId { get; set; }
    
    public string? AppleId { get; set; }
    
    public string? MicrosoftId { get; set; }
    
    public Guid? TenantId { get; set; }
    
    public Guid? FacilityId { get; set; }
    
    public string[] Roles { get; set; } = { "User" };
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? LastLoginAt { get; set; }
    
    // Navigation properties
    public Tenant? Tenant { get; set; }
    
    public Facility? Facility { get; set; }
}

public class Tenant
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public string Name { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class Facility
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public string Name { get; set; } = string.Empty;
    
    public string? Address { get; set; }
    
    public string? City { get; set; }
    
    public string? State { get; set; }
    
    public string? ZipCode { get; set; }
    
    public Guid TenantId { get; set; }
    
    public Tenant? Tenant { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

// Request/Response DTOs
public class RegisterRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [MinLength(2)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [MinLength(2)]
    public string LastName { get; set; } = string.Empty;
    
    public string? Company { get; set; }
    
    public string? Phone { get; set; }
    
    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;
    
    [Required]
    public string ConfirmPassword { get; set; } = string.Empty;
}

public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string Password { get; set; } = string.Empty;
    
    public bool RememberMe { get; set; } = false;
}

public class SocialLoginRequest
{
    [Required]
    public string Provider { get; set; } = string.Empty; // google, apple, microsoft
    
    [Required]
    public string IdToken { get; set; } = string.Empty;
    
    public string? Email { get; set; }
    
    public string? FirstName { get; set; }
    
    public string? LastName { get; set; }
    
    public string? Company { get; set; }
}

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    
    public UserInfo User { get; set; } = new();
    
    public DateTime ExpiresAt { get; set; }
}

public class UserInfo
{
    public Guid Id { get; set; }
    
    public string Email { get; set; } = string.Empty;
    
    public string FirstName { get; set; } = string.Empty;
    
    public string LastName { get; set; } = string.Empty;
    
    public string? Company { get; set; }
    
    public string? Phone { get; set; }
    
    public Guid? TenantId { get; set; }
    
    public Guid? FacilityId { get; set; }
    
    public string[] Roles { get; set; } = Array.Empty<string>();
    
    public DateTime CreatedAt { get; set; }
    
    public DateTime? LastLoginAt { get; set; }
}
