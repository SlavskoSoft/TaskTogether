using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TaskTogether.Models;
using TaskTogether.Settings;

namespace TaskTogether.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(IMongoClient client, IOptions<MongoDbSettings> settings)
        {
            var db = client.GetDatabase(settings.Value.DatabaseName);
            _users = db.GetCollection<User>("users");
        }

        public async Task<User?> GetByEmailAsync(string? email) =>
            await _users.Find(u => u.Email == email).FirstOrDefaultAsync();

        public async Task CreateAsync(User user) =>
            await _users.InsertOneAsync(user);
    }
}
