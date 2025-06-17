using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("reservation")]
    public class Reservation
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("room_id")]
        public int RoomId { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("number_of_guests")]
        public int NumberOfGuests { get; set; }

        [Column("total_price")]
        public int TotalPrice { get; set; }

        [Column("check_in_date")]
        public DateTime CheckInDate { get; set; }

        [Column("check_out_date")]
        public DateTime CheckOutDate { get; set; }
    }
} 