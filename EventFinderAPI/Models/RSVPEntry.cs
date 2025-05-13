using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

public class RSVPEntry
{
    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; }

    public int TicketsReserved { get; set; } 
}
