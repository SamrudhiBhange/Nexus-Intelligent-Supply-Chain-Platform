using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Nexus.Services.Identity.DTOs;
using Nexus.Services.Identity.Models;
using Nexus.Services.Identity.Services;
using Nexus.Shared.Contracts.DTOs;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace Nexus.Services.Identity.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            IAuthService authService,
            UserManager<ApplicationUser> userManager,
            ILogger<AuthController> logger)
        {
            _authService = authService;
            _userManager = userManager;
            _logger = logger;
        }

        [HttpPost("register")]
        [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] SimpleRegisterRequest request)
        {
            try
            {
                // Validate model
                if (!ModelState.IsValid)
                {
                    return BadRequest(Nexus.Shared.Contracts.DTOs.ApiResponse<object>.ErrorResponse(
                        "Invalid request data",
                        ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()));
                }

                var result = await _authService.RegisterAsync(request.Email, request.Password);

                if (result.Succeeded)
                {
                    var user = await _userManager.FindByEmailAsync(request.Email);
                    if (user == null)
                    {
                        return BadRequest(Nexus.Shared.Contracts.DTOs.ApiResponse<object>.ErrorResponse("User not found after registration"));
                    }

                    // Generate token using AuthService
                    var token = _authService.GenerateToken(user);

                    return Ok(Nexus.Shared.Contracts.DTOs.ApiResponse<AuthResponse>.SuccessResponse(
                        new AuthResponse
                        {
                            AccessToken = token,
                            RefreshToken = "", // You'll need to implement refresh tokens
                            ExpiresAt = DateTime.UtcNow.AddHours(3)
                        },
                        "Registration successful"));
                }

                return BadRequest(Nexus.Shared.Contracts.DTOs.ApiResponse<object>.ErrorResponse(
                    "Registration failed",
                    result.Errors.Select(e => e.Description).ToList()));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration");
                return BadRequest(Nexus.Shared.Contracts.DTOs.ApiResponse<object>.ErrorResponse(ex.Message));
            }
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                // Validate model
                if (!ModelState.IsValid)
                {
                    return BadRequest(Nexus.Shared.Contracts.DTOs.ApiResponse<object>.ErrorResponse(
                        "Invalid request data",
                        ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()));
                }

                // Use the AuthService's LoginAsync which now returns AuthResponse
                var authResponse = await _authService.LoginAsync(request.Email, request.Password);

                return Ok(Nexus.Shared.Contracts.DTOs.ApiResponse<AuthResponse>.SuccessResponse(
                    authResponse,
                    "Login successful"));
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(Nexus.Shared.Contracts.DTOs.ApiResponse<object>.ErrorResponse("Invalid credentials"));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(Nexus.Shared.Contracts.DTOs.ApiResponse<object>.ErrorResponse(ex.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return StatusCode(500, Nexus.Shared.Contracts.DTOs.ApiResponse<object>.ErrorResponse("An error occurred during login"));
            }
        }

        [HttpPost("refresh")]
        [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest request)
        {
            try
            {
                // Use AuthService's RefreshTokenAsync
                var authResponse = await _authService.RefreshTokenAsync(request.AccessToken, request.RefreshToken);

                return Ok(Nexus.Shared.Contracts.DTOs.ApiResponse<AuthResponse>.SuccessResponse(authResponse, "Token refreshed"));
            }
            catch (SecurityTokenException ex)
            {
                return BadRequest(Nexus.Shared.Contracts.DTOs.ApiResponse<object>.ErrorResponse(ex.Message));
            }
            catch (NotImplementedException)
            {
                return StatusCode(501, Nexus.Shared.Contracts.DTOs.ApiResponse<object>.ErrorResponse("Refresh token not implemented yet"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token refresh");
                return StatusCode(500, Nexus.Shared.Contracts.DTOs.ApiResponse<object>.ErrorResponse("An error occurred refreshing token"));
            }
        }

        [Authorize]
        [HttpPost("logout")]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        public async Task<IActionResult> Logout()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(Nexus.Shared.Contracts.DTOs.ApiResponse<object>.ErrorResponse("User not authenticated"));
                }

                await _authService.LogoutAsync(userId);

                return Ok(Nexus.Shared.Contracts.DTOs.ApiResponse<object>.SuccessResponse(null, "Logged out successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout");
                return StatusCode(500, Nexus.Shared.Contracts.DTOs.ApiResponse<object>.ErrorResponse("An error occurred during logout"));
            }
        }

        [Authorize]
        [HttpGet("profile")]
        [ProducesResponseType(typeof(ApiResponse<UserProfileResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(Nexus.Shared.Contracts.DTOs.ApiResponse<object>.ErrorResponse("User not authenticated"));
                }

                var profile = await _authService.GetUserProfileAsync(userId);
                return Ok(Nexus.Shared.Contracts.DTOs.ApiResponse<UserProfileResponse>.SuccessResponse(profile, "Profile retrieved"));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(Nexus.Shared.Contracts.DTOs.ApiResponse<object>.ErrorResponse(ex.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving profile");
                return StatusCode(500, Nexus.Shared.Contracts.DTOs.ApiResponse<object>.ErrorResponse("An error occurred retrieving profile"));
            }
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] DTOs.UpdateProfileRequest request) // Specify DTOs namespace
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid request",
                        errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)
                    });
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { success = false, message = "User not authenticated" });
                }

                await _authService.UpdateUserProfileAsync(userId, request);
                return Ok(new { success = true, message = "Profile updated successfully" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating profile");
                return StatusCode(500, new { success = false, message = "An error occurred updating profile" });
            }
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] DTOs.ChangePasswordRequest request) // Specify DTOs namespace
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid request",
                        errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)
                    });
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { success = false, message = "User not authenticated" });
                }

                await _authService.ChangePasswordAsync(userId, request);
                return Ok(new { success = true, message = "Password changed successfully" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password");
                return StatusCode(500, new { success = false, message = "An error occurred changing password" });
            }
        }

        [Authorize]
        [HttpGet("validate")]
        [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> ValidateToken()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(Nexus.Shared.Contracts.DTOs.ApiResponse<object>.ErrorResponse("User not authenticated"));
                }

                // Get user from database
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return Unauthorized(Nexus.Shared.Contracts.DTOs.ApiResponse<object>.ErrorResponse("User not found"));
                }

                // Get user roles
                var roles = await _userManager.GetRolesAsync(user);

                var userDto = new UserDto
                {
                    Id = Guid.TryParse(userId, out Guid guidId) ? guidId : Guid.Empty,
                    Email = user.Email ?? string.Empty,
                    FirstName = user.GetType().GetProperty("FirstName")?.GetValue(user) as string ?? string.Empty,
                    LastName = user.GetType().GetProperty("LastName")?.GetValue(user) as string ?? string.Empty,
                    Roles = roles.ToList()
                };

                return Ok(Nexus.Shared.Contracts.DTOs.ApiResponse<UserDto>.SuccessResponse(userDto, "Token is valid"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating token");
                return StatusCode(500, Nexus.Shared.Contracts.DTOs.ApiResponse<object>.ErrorResponse("An error occurred validating token"));
            }
        }

        #region Request/Response Classes

        // Use this simple register request since your AuthService.RegisterAsync only needs email and password
        public class SimpleRegisterRequest
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; } = string.Empty;

            [Required]
            [MinLength(6)]
            public string Password { get; set; } = string.Empty;
        }

        public class LoginRequest
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; } = string.Empty;

            [Required]
            public string Password { get; set; } = string.Empty;
        }

        public class RefreshTokenRequest
        {
            [Required]
            public string AccessToken { get; set; } = string.Empty;

            [Required]
            public string RefreshToken { get; set; } = string.Empty;
        }

        public class UpdateProfileRequest
        {
            [Required]
            [MaxLength(100)]
            public string FirstName { get; set; } = string.Empty;

            [Required]
            [MaxLength(100)]
            public string LastName { get; set; } = string.Empty;

            [Phone]
            public string? PhoneNumber { get; set; }

            [Url]
            public string? ProfileImageUrl { get; set; }
        }

        public class ChangePasswordRequest
        {
            [Required]
            public string CurrentPassword { get; set; } = string.Empty;

            [Required]
            [MinLength(6)]
            public string NewPassword { get; set; } = string.Empty;

            [Required]
            [Compare("NewPassword")]
            public string ConfirmPassword { get; set; } = string.Empty;
        }

        #endregion
    }
}

    // Add this ApiResponse class at the bottom of AuthController.cs
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<string>? Errors { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public static ApiResponse<T> SuccessResponse(T data, string message = "")
        {
            return new ApiResponse<T>
            {
                Success = true,
                Data = data,
                Message = message
            };
        }

        public static ApiResponse<T> ErrorResponse(string message, List<string>? errors = null)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Errors = errors
            };
        }
    }
