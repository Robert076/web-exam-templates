using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers
{
    [Route("api/rooms")]
    [ApiController]
    public class HotelRoomController : ControllerBase
    {
        private readonly HotelRoomService _hotelRoomService;

        public HotelRoomController(HotelRoomService hotelRoomService)
        {
            _hotelRoomService = hotelRoomService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HotelRoom>>> GetRooms()
        {
            var rooms = await _hotelRoomService.GetRoomsAsync();
            return Ok(rooms);
        }

        [HttpPost]
        public async Task<ActionResult<HotelRoom>> AddRoom([FromBody] HotelRoom room)
        {
            var addedRoom = await _hotelRoomService.AddRoomAsync(room);
            return CreatedAtAction(nameof(GetRooms), new { id = addedRoom.Id }, addedRoom);
        }

        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<HotelRoom>>> GetAvailableRooms([FromQuery] DateTime checkIn, [FromQuery] DateTime checkOut)
        {
            if (checkIn >= checkOut)
            {
                return BadRequest(new { message = "Check-in date must be before check-out date." });
            }
            var rooms = await _hotelRoomService.GetAvailableRoomsAsync(checkIn, checkOut);
            return Ok(rooms);
        }
    }
} 