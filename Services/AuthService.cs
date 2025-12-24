using MassTransit;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Nexus.Services.Identity.DTOs;
using Nexus.Services.Identity.Models;
using Nexus.Shared.Contracts.Events;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace Nexus.Services.Identity.Services;

public interface IAuthService
{
    Task<IdentityResult> RegisterAsync(string email, string password);
    Task<AuthResponse> LoginAsync(string email, string password);
    string GenerateToken(ApplicationUser user);
    Task<AuthResponse> RefreshTokenAsync(string accessToken, string refreshToken);
    Task LogoutAsync(string userId);
    Task<UserProfileResponse> GetUserProfileAsync(string userId);
    Task UpdateUserProfileAsync(string userId, UpdateProfileRequest request);
    Task ChangePasswordAsync(string userId, ChangePasswordRequest request);
}

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;
    private readonly ITokenService _tokenService;
    private readonly ILogger<AuthService> _logger;
    private readonly IPublishEndpoint _publishEndpoint;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        RoleManager<IdentityRole> roleManager,
        IConfiguration configuration,
        ITokenService tokenService,
        ILogger<AuthService> logger,
        IPublishEndpoint publishEndpoint)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _roleManager = roleManager;
        _configuration = configuration;
        _tokenService = tokenService;
        _logger = logger;
        _publishEndpoint = publishEndpoint;
    }

    // FIXED: Changed return type to IdentityResult (matching interface)
    public async Task<IdentityResult> RegisterAsync(string email, string password)
    {
        try
        {
            // Check if user already exists
            var existingUser = await _userManager.FindByEmailAsync(email);
            if (existingUser != null)
                throw new InvalidOperationException($"User with email {email} already exists.");

            // Create new user
            var user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, password);

            if (result.Succeeded)
            {
                // Check if "User" role exists before assigning
                var roleExists = await _roleManager.RoleExistsAsync("User");
                if (roleExists)
                {
                    await _userManager.AddToRoleAsync(user, "User");
                }
                else
                {
                    // Option 1: Create the role on the fly
                    await _roleManager.CreateAsync(new IdentityRole("User"));
                    await _userManager.AddToRoleAsync(user, "User");

                    // Option 2: Just log a warning and continue without role assignment
                    // _logger.LogWarning("Role 'User' does not exist. User registered without role assignment.");
                }
            }

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration for email: {Email}", email);
            throw;
        }
    }

    // FIXED: Changed parameter to match interface (string, string) not LoginRequest
    public async Task<AuthResponse> LoginAsync(string email, string password)
    {
        try
        {
            _logger.LogInformation("Login attempt for email: {Email}", email);

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                _logger.LogWarning("User not found for email: {Email}", email);
                throw new UnauthorizedAccessException("Invalid credentials");
            }

            _logger.LogInformation("User found: {UserId}, IsActive: {IsActive}",
                user.Id, user.GetType().GetProperty("IsActive")?.GetValue(user) ?? "N/A");

            var result = await _signInManager.CheckPasswordSignInAsync(
                user, password, lockoutOnFailure: true);

            _logger.LogInformation("Password check result: {Succeeded}, {IsLockedOut}, {IsNotAllowed}",
                result.Succeeded, result.IsLockedOut, result.IsNotAllowed);

            if (!result.Succeeded)
            {
                if (result.IsLockedOut)
                    throw new InvalidOperationException("Account is locked out");
                if (result.IsNotAllowed)
                    throw new InvalidOperationException("Account is not allowed to login");

                throw new UnauthorizedAccessException("Invalid credentials");
            }

            // Generate token
            var roles = await _userManager.GetRolesAsync(user);
            _logger.LogInformation("User roles: {@Roles}", roles);

            var token = GenerateToken(user);
            _logger.LogInformation("Token generated successfully for user: {UserId}", user.Id);

            return new AuthResponse
            {
                AccessToken = token,
                RefreshToken = "", // You'll need to implement refresh tokens
                ExpiresAt = DateTime.UtcNow.AddHours(3),
                User = new UserDto
                {
                    Id = Guid.TryParse(user.Id, out Guid userIdGuid) ? userIdGuid : Guid.Empty,
                    Email = user.Email ?? string.Empty,
                    FirstName = user.GetType().GetProperty("FirstName")?.GetValue(user) as string ?? "",
                    LastName = user.GetType().GetProperty("LastName")?.GetValue(user) as string ?? "",
                    Roles = roles.ToList()
                }
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for email: {Email}", email);
            throw; // Re-throw to be caught by controller
        }
    }

    // FIXED: Added missing GenerateToken method
    public string GenerateToken(ApplicationUser user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        // Add user roles
        var roles = _userManager.GetRolesAsync(user).Result;
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
            _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured")));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(3),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    // Helper method for refresh token generation
    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    // Other interface methods remain the same
    public async Task<AuthResponse> RefreshTokenAsync(string accessToken, string refreshToken)
    {
        try
        {
            // Implementation depends on your TokenService
            // For now, return not implemented
            throw new NotImplementedException("RefreshTokenAsync not implemented");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token refresh");
            throw;
        }
    }

    public async Task LogoutAsync(string userId)
    {
        try
        {
            if (_tokenService != null)
            {
                await _tokenService.RevokeRefreshTokenAsync(userId);
            }
            _logger.LogInformation("User logged out: {UserId}", userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout for user: {UserId}", userId);
            throw;
        }
    }

    public async Task<UserProfileResponse> GetUserProfileAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            throw new KeyNotFoundException($"User with ID {userId} not found");

        var roles = await _userManager.GetRolesAsync(user);

        return new UserProfileResponse
        {
            Id = Guid.TryParse(user.Id, out Guid userIdGuid) ? userIdGuid : Guid.Empty,
            Email = user.Email!,
            FirstName = user.GetType().GetProperty("FirstName")?.GetValue(user) as string ?? "",
            LastName = user.GetType().GetProperty("LastName")?.GetValue(user) as string ?? "",
            PhoneNumber = user.PhoneNumber,
            // Check if properties exist before accessing
            IsActive = user.GetType().GetProperty("IsActive")?.GetValue(user) as bool? ?? true,
            TwoFactorEnabled = user.TwoFactorEnabled,
            ProfileImageUrl = user.GetType().GetProperty("ProfileImageUrl")?.GetValue(user) as string,
            CreatedAt = user.GetType().GetProperty("CreatedAt")?.GetValue(user) as DateTime? ?? DateTime.UtcNow,
            LastLoginAt = user.GetType().GetProperty("LastLoginAt")?.GetValue(user) as DateTime?,
            Roles = roles.ToList()
        };
    }

    public async Task UpdateUserProfileAsync(string userId, UpdateProfileRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            throw new KeyNotFoundException($"User with ID {userId} not found");

        // Update properties if they exist
        var firstNameProp = user.GetType().GetProperty("FirstName");
        if (firstNameProp != null) firstNameProp.SetValue(user, request.FirstName);

        var lastNameProp = user.GetType().GetProperty("LastName");
        if (lastNameProp != null) lastNameProp.SetValue(user, request.LastName);

        user.PhoneNumber = request.PhoneNumber;

        var profileImageProp = user.GetType().GetProperty("ProfileImageUrl");
        if (profileImageProp != null) profileImageProp.SetValue(user, request.ProfileImageUrl);

        var updatedAtProp = user.GetType().GetProperty("UpdatedAt");
        if (updatedAtProp != null) updatedAtProp.SetValue(user, DateTime.UtcNow);

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Profile update failed: {errors}");
        }
    }

    public async Task ChangePasswordAsync(string userId, ChangePasswordRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            throw new KeyNotFoundException($"User with ID {userId} not found");

        var result = await _userManager.ChangePasswordAsync(
            user, request.CurrentPassword, request.NewPassword);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Password change failed: {errors}");
        }
    }
}