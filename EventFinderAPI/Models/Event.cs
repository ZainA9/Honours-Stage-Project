namespace EventFinderAPI.Models
{
    using MongoDB.Bson;
    using MongoDB.Bson.Serialization.Attributes;
    using System.ComponentModel.DataAnnotations;

    public class Event
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; } // MongoDB ID (automatically generated)

        [Required]
        public string Name { get; set; } // Event name

        [Required]
        public string Description { get; set; } // Event description

        [Required]
        public string Location { get; set; } // Event location

        [Required]
        public DateTime Date { get; set; } // Event date & time

        [Required]
        public string[] Categories { get; set; }
        public int Capacity { get; set; } // Max number of attendees

        public decimal Price { get; set; } // Ticket price (0 if free)

        public bool IsPublic { get; set; } // Public or private event

        public int? MaxTicketsPerUser { get; set; } // Limit per user

        public List<RSVPEntry> Attendees { get; set; } = new List<RSVPEntry>(); // Stores RSVPs

        [BsonRepresentation(BsonType.ObjectId)]
        public string? CreatedBy { get; set; } // Nullable to prevent errors
    }
}
