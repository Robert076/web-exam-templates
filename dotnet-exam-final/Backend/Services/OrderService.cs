using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Services
{
    public class OrderService
    {
        private readonly LibraryContext _context;

        public OrderService(LibraryContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Order>> GetUserOrdersAsync(int userId)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.Id)
                .ToListAsync();
        }

        public async Task<Order?> GetOrderByIdAsync(int orderId, int userId)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);
        }

        public async Task<Order> CreateOrderAsync(int userId, List<OrderItemRequest> items)
        {
            var order = new Order
            {
                UserId = userId
            };

            decimal totalPrice = 0;

            foreach (var itemRequest in items)
            {
                var product = await _context.Products.FindAsync(itemRequest.ProductId);
                if (product == null)
                    throw new ArgumentException($"Product with ID {itemRequest.ProductId} not found");

                // Create order item for each quantity
                for (int i = 0; i < itemRequest.Quantity; i++)
                {
                    var orderItem = new OrderItem
                    {
                        ProductId = itemRequest.ProductId
                    };

                    order.OrderItems.Add(orderItem);
                    totalPrice += product.Price;
                }
            }

            order.TotalPrice = totalPrice;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return order;
        }
    }

    public class OrderItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; } = 1;
    }
}