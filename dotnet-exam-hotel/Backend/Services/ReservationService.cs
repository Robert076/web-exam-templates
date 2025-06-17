using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Services
{
    public class ReservationService
    {
        private readonly LibraryContext _context;

        public ReservationService(LibraryContext context)
        {
            _context = context;
        }

        public async Task<bool> IsRoomAvailable(int roomId, DateTime checkIn, DateTime checkOut)
        {
            return !await _context.Reservations.AnyAsync(r =>
                r.RoomId == roomId &&
                r.CheckInDate < checkOut &&
                r.CheckOutDate > checkIn
            );
        }

        public async Task<Reservation?> AddReservationAsync(Reservation reservation)
        {
            if (!await IsRoomAvailable(reservation.RoomId, reservation.CheckInDate, reservation.CheckOutDate))
                return null;

            // --- Dynamic Pricing Logic Start ---
            // Get total number of rooms
            int totalRooms = await _context.HotelRooms.CountAsync();
            // Get number of rooms booked for the period
            var reservedRoomIds = await _context.Reservations
                .Where(r => r.CheckInDate < reservation.CheckOutDate && r.CheckOutDate > reservation.CheckInDate)
                .Select(r => r.RoomId)
                .Distinct()
                .ToListAsync();
            int bookedRooms = reservedRoomIds.Count;
            decimal occupancy = totalRooms == 0 ? 0 : (decimal)bookedRooms / totalRooms;

            // Get base price for the selected room
            var room = await _context.HotelRooms.FirstOrDefaultAsync(r => r.Id == reservation.RoomId);
            if (room == null) return null;
            decimal basePrice = room.BasePrice;
            decimal finalPrice = basePrice;
            if (occupancy > 0.5m && occupancy <= 0.8m)
                finalPrice = basePrice * 1.2m;
            else if (occupancy > 0.8m)
                finalPrice = basePrice * 1.5m;
            // Calculate total price for the stay
            int days = (int)Math.Ceiling((reservation.CheckOutDate - reservation.CheckInDate).TotalDays);
            if (days < 1) days = 1;
            reservation.TotalPrice = (int)(finalPrice * days);
            // --- Dynamic Pricing Logic End ---

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();
            return reservation;
        }

        public async Task<IEnumerable<Reservation>> GetReservationsForUserAsync(int userId)
        {
            return await _context.Reservations
                .Where(r => r.UserId == userId)
                .ToListAsync();
        }
    }
} 