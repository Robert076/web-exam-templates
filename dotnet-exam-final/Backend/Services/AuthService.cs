using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Services
{
    public class AuthService
    {
        private readonly LibraryContext _context;

        public AuthService(LibraryContext context)
        {
            _context = context;
        }

        public async Task<AuthResponse> Login(LoginRequest model)
        {
            // Find user by username
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == model.Username);

            // Check if user exists
            if (user == null)
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "User not found"
                };
            }

            return new AuthResponse
            {
                Success = true,
                Message = "Login successful",
                UserId = user.Id,
                Username = user.Username
            };
        }

        // Method to check if a username exists
        public async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(u => u.Username == username);
        }
    }
}