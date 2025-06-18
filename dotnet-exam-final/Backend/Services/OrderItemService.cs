using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Services
{
    public class OrderItemService
    {
        private readonly LibraryContext _context;

        public OrderItemService(LibraryContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<OrderItem>> GetAllOrderItemsAsync()
        {
            return await _context.OrderItems.ToListAsync();
        }

        public async Task<OrderItem?> GetOrderItemByIdAsync(int id)
        {
            return await _context.OrderItems.FindAsync(id);
        }
    }
}