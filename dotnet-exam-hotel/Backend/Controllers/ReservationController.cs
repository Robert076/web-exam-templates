using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/reservations")]
    [ApiController]
    [Authorize]
    public class ReservationController : ControllerBase
    {
        private readonly ReservationService _reservationService;

        public ReservationController(ReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                throw new UnauthorizedAccessException("Invalid user ID in token");
            }
            return userId;
        }

        [HttpPost]
        public async Task<IActionResult> AddReservation([FromBody] Reservation reservation)
        {
            reservation.UserId = GetUserId();
            var result = await _reservationService.AddReservationAsync(reservation);
            if (result == null)
            {
                return BadRequest(new { message = "Room is not available for the selected dates." });
            }
            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetMyReservations()
        {
            var userId = GetUserId();
            var reservations = await _reservationService.GetReservationsForUserAsync(userId);
            return Ok(reservations);
        }
    }
} 