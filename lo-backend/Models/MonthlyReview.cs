using System.ComponentModel.DataAnnotations;

namespace Lights_Off.Models
{
    // a saved AI review of one month, so Claude is only asked once per month
    public class MonthlyReview
    {
        [Key]
        public int MonthlyReviewId { get; set; }

        [Required]
        public int Year { get; set; }

        [Required]
        [Range(1, 12)]
        public int Month { get; set; }

        // what Claude wrote
        [Required]
        public string Review { get; set; } = null!;

        // when the review was made
        public DateTime CreatedAt { get; set; }

        [Required]
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
