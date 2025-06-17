using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Services
{
    public class HotelRoomService
    {
        private readonly LibraryContext _context;

        public HotelRoomService(LibraryContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<HotelRoom>> GetRoomsAsync()
        {
            return await _context.HotelRooms.ToListAsync();
        }

        public async Task<HotelRoom> AddRoomAsync(HotelRoom room)
        {
            _context.HotelRooms.Add(room);
            await _context.SaveChangesAsync();
            return room;
        }

        public async Task<IEnumerable<HotelRoom>> GetAvailableRoomsAsync(DateTime checkIn, DateTime checkOut)
        {
            // A room is available if it has no reservation that overlaps with the given period
            var reservedRoomIds = await _context.Reservations
                .Where(r => r.CheckInDate < checkOut && r.CheckOutDate > checkIn)
                .Select(r => r.RoomId)
                .Distinct()
                .ToListAsync();

            return await _context.HotelRooms
                .Where(room => !reservedRoomIds.Contains(room.Id))
                .ToListAsync();
        }
    }
} 