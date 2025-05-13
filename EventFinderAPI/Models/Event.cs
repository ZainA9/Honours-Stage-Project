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
        public string Name { get; set; } 

        [Required]
        public string Description { get; set; } 

        [Required]
        public string Location { get; set; } 

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }


        [Required]
        public DateTime Date { get; set; } 

        [Required]
        public string[] Categories { get; set; }
        public int Capacity { get; set; } 

        public decimal Price { get; set; } 

        public bool IsPublic { get; set; } 

        public int? MaxTicketsPerUser { get; set; } 

        public List<RSVPEntry> Attendees { get; set; } = new List<RSVPEntry>(); // Stores RSVPs

        [BsonRepresentation(BsonType.ObjectId)]
        public string? CreatedBy { get; set; } // Nullable to prevent errors
    }
}
