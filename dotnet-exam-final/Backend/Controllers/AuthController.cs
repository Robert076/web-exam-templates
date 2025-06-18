using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        {
            var result = await _authService.Login(request);
            if (!result.Success)
                return BadRequest(result);
            
            // Store user info in session
            HttpContext.Session.SetString("UserId", result.UserId.ToString()!);
            HttpContext.Session.SetString("Username", result.Username!);
            
            return Ok(result);
        }

        [HttpGet("check-username/{username}")]
        public async Task<ActionResult> CheckUsernameExists(string username)
        {
            var exists = await _authService.UserExists(username);
            return Ok(new { exists });
        }

        [HttpPost("logout")]
        public ActionResult Logout()
        {
            HttpContext.Session.Clear();
            return Ok(new { message = "Logged out successfully" });
        }
    }
} 