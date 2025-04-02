namespace EventFinderAPI.Data
{
    using MongoDB.Driver;
    using Microsoft.Extensions.Options;

    public class MongoDBService
    {
        private readonly IMongoDatabase _database;

        public MongoDBService(IConfiguration config)
        {
            string connectionString = config.GetConnectionString("MongoDB");
            MongoClient client = new MongoClient(connectionString);
            _database = client.GetDatabase(config["DatabaseSettings:DatabaseName"]);
        }

        public IMongoCollection<T> GetCollection<T>(string collectionName)
        {
            return _database.GetCollection<T>(collectionName);
        }
    }

}
