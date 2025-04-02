namespace EventFinderAPI.Models
{
    using MongoDB.Bson;
    using MongoDB.Bson.Serialization.Attributes;

    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; } //nullable as mongoDB will assign itself

        public string FullName { get; set; } //Required from User

        public string Email { get; set; } //Required from User

        public string PasswordHash { get; set; }  //Required from User

        public string[]? Interests { get; set; } // Nullable as some may not choose it
    }

    public class UpdateUserProfileRequest //can change any doesnt have to be all 
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string[]? Interests { get; set; }
    }

}