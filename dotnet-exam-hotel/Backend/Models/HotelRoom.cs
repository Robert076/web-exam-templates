using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("hotel_room")]
    public class HotelRoom
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("room_number")]
        public int RoomNumber { get; set; }

        [Column("base_price")]
        public decimal BasePrice { get; set; }

        [Column("capacity")]
        public int Capacity { get; set; }
    }
} 