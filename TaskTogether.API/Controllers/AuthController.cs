namespace TaskTogether.API.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using TaskTogether.API.Models;
    using TaskTogether.API.Services;

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly JwtService _jwtService;

        public AuthController(UserService userService, JwtService jwtService)
        {
            _userService = userService;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest("Email and password are required");
            }

            var existingUser = await _userService.GetByEmailAsync(request.Email);
            if (existingUser != null)
            {
                return Conflict("User already exists");
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new User
            {
                Id = Guid.NewGuid().ToString(),
                Email = request.Email.ToLower(),
                PasswordHash = passwordHash,
                Role = request.Role,
                FamilyId = Guid.NewGuid().ToString()
            };

            await _userService.CreateAsync(user);

            var token = _jwtService.GenerateToken(user);

            return Ok(new AuthResponse { Token = token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _userService.GetByEmailAsync(request?.Email);
            if (user == null)
            {
                return Unauthorized("Invalid credentials");
            }

            var validPassword = BCrypt.Net.BCrypt.Verify(
                request?.Password, user?.PasswordHash);

            if (!validPassword)
            {
                return Unauthorized("Invalid credentials");
            }

            var token = _jwtService.GenerateToken(user);

            return Ok(new AuthResponse { Token = token });
        }

        [Authorize]
        [HttpGet("current")]
        public IActionResult Current()
        {
            return Ok(new
            {
                UserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value,
                Role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value,
                FamilyId = User.FindFirst("familyId")?.Value
            });
        }
    }
}
