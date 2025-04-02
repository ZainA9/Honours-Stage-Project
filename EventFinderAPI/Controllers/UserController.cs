using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using EventFinderAPI.Models;
using EventFinderAPI.Data;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace EventFinderAPI.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMongoCollection<User> _usersCollection;
        private readonly IMongoCollection<Event> _eventsCollection;

        public UserController(MongoDBService mongoDBService, IConfiguration config) // Getting user collection from db
        {
            _usersCollection = mongoDBService.GetCollection<User>(config["DatabaseSettings:UsersCollectionName"]);
            _eventsCollection = mongoDBService.GetCollection<Event>(config["DatabaseSettings:EventsCollectionName"]); // 🔹 Add this
        }
        [HttpPost] //extracting info from request body
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            if (string.IsNullOrEmpty(user.FullName) || string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.PasswordHash))
            {
                return BadRequest("Full Name, Email, and Password are required.");
            }

            
            var existingUser = await _usersCollection.Find(u => u.Email == user.Email).FirstOrDefaultAsync(); //quierying db to see if email exists
            if (existingUser != null)
            {
                return BadRequest("Email is already registered.");
            }

            //hash the password before saving
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);

            await _usersCollection.InsertOneAsync(user);
            return Ok(new { message = "User created successfully!" });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetUserProfile()
        {
            var userId = User.FindFirst("sub")?.Value;

            // 🔹 If 'sub' is missing, try 'nameidentifier'
            if (string.IsNullOrEmpty(userId))
            {
                Console.WriteLine("[ERROR] No 'sub' claim found. Checking alternative claim names...");
                userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            }

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Invalid token. User not found.");
            }

            // 🔹 Find user in the database
            var user = await _usersCollection.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound(new { message = "User profile not found." });
            }

            // 🔹 Return user profile (excluding password)
            return Ok(new
            {
                id = user.Id,
                fullName = user.FullName,
                email = user.Email,
                interests = user.Interests
            });
        }

        [Authorize]
        [HttpPut("me")]
        public async Task<IActionResult> UpdateUserProfile([FromBody] UpdateUserProfileRequest updatedUser, [FromServices] SmtpEmailService emailService)
        {
            var userId = User.FindFirst("sub")?.Value;

            // 🔹 If 'sub' is missing, try 'nameidentifier'
            if (string.IsNullOrEmpty(userId))
            {
                Console.WriteLine("[ERROR] No 'sub' claim found. Checking alternative claim names...");
                userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            }

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Invalid token. User not found.");
            }

            // 🔹 Find the user in the database
            var user = await _usersCollection.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound(new { message = "User profile not found." });
            }

            // 🔹 Update user details if provided (keep original values if not provided)
            user.FullName = updatedUser.FullName ?? user.FullName;
            user.Email = updatedUser.Email ?? user.Email;

            // 🔹 Hash the new password if provided
            if (!string.IsNullOrEmpty(updatedUser.Password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updatedUser.Password);
            }

            user.Interests = updatedUser.Interests ?? user.Interests;

            // 🔹 Save updates in the database
            await _usersCollection.ReplaceOneAsync(u => u.Id == userId, user);

            //send email after successful update
            string subject = "Your EventFinder Profile Was Updated";
            string body = $"Hi {user.FullName},\n\nThis is a confirmation that your profile on EventFinder has been updated successfully.\n\n" +
                          "If you didn’t make this change, please contact support immediately.\n\n– EventFinder Team";

            await emailService.SendEmailAsync(user.Email, subject, body);

            return Ok(new { message = "User profile updated successfully! Confirmation email sent." });
        }

        [Authorize]
        [HttpDelete("me")]
        public async Task<IActionResult> DeleteUserAccount([FromServices] SmtpEmailService emailService)
        {
            var userId = User.FindFirst("sub")?.Value;

            // 🔹 If 'sub' is missing, try 'nameidentifier'
            if (string.IsNullOrEmpty(userId))
            {
                Console.WriteLine("[ERROR] No 'sub' claim found. Checking alternative claim names...");
                userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            }

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Invalid token. User not found.");
            }

            // 🔹 Find the user in the database
            var user = await _usersCollection.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            // ✅ Send deletion confirmation email
            string subject = "Your EventFinder Account Has Been Deleted";
            string body = $"Hi {user.FullName},\n\nThis is to confirm that your EventFinder account ({user.Email}) has been permanently deleted.\n\n" +
                          "We're sorry to see you go. If you ever want to join us again, you're always welcome back!\n\n– EventFinder Team";

            await emailService.SendEmailAsync(user.Email, subject, body);

            // 🔹 Delete user from database
            await _usersCollection.DeleteOneAsync(u => u.Id == userId);

            // 🔹 Remove user from all RSVP lists in events
            var filter = Builders<Event>.Filter.ElemMatch(e => e.Attendees, a => a.UserId == userId);
            var update = Builders<Event>.Update.PullFilter(e => e.Attendees, a => a.UserId == userId);
            await _eventsCollection.UpdateManyAsync(filter, update);

            return Ok(new { message = "User account deleted successfully! Confirmation Email sent." });
        }


    }
}
