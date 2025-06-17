using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string? Genre { get; set; }
        public int? Pages { get; set; }
        
        [Column("lent_to")]
        public string? LentTo { get; set; }
        
        [Column("lent_date")]
        public DateTime? LentDate { get; set; }
        
        [Column("user_id")]
        public int UserId { get; set; }
    }
} 