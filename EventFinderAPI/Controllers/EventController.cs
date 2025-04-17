using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using EventFinderAPI.Models;
using EventFinderAPI.Data;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;


namespace EventFinderAPI.Controllers
{
    [Route("api/events")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly IMongoCollection<Event> _eventsCollection;
        private readonly IMongoCollection<User> _usersCollection;


        public EventController(MongoDBService mongoDBService, IConfiguration config)
        {
            _eventsCollection = mongoDBService.GetCollection<Event>(config["DatabaseSettings:EventsCollectionName"]);
            _usersCollection = mongoDBService.GetCollection<User>(config["DatabaseSettings:UsersCollectionName"]);
        }



        //Creates event in db and only accessible to logged in users
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] Event eventData, [FromServices] SmtpEmailService emailService)
        {
            Console.WriteLine("[DEBUG] Checking Token Claims...");
            foreach (var claim in User.Claims)
            {
                Console.WriteLine($"[DEBUG] Claim Type: {claim.Type}, Value: {claim.Value}");
            }

            var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                Console.WriteLine("[ERROR] No 'sub' claim found. Checking alternative claim names...");
                userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            }

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Invalid token. User not found.");
            }

            Console.WriteLine($"[DEBUG] Extracted User ID: {userId}");
            eventData.CreatedBy = userId;

            // ✅ Default max tickets
            if (eventData.MaxTicketsPerUser <= 0)
            {
                eventData.MaxTicketsPerUser = 10;
            }

            // ✅ Geocode the location to get coordinates
            var coords = await GeocodeLocationAsync(eventData.Location);
            if (coords != null)
            {
                eventData.Latitude = coords.Value.lat;
                eventData.Longitude = coords.Value.lng;

                Console.WriteLine($"[DEBUG] Geocoded: {eventData.Location} => {coords.Value.lat}, {coords.Value.lng}");
            }
            else
            {
                Console.WriteLine("[WARNING] Geocoding failed. Coordinates not saved.");
            }

            // ✅ Save event
            await _eventsCollection.InsertOneAsync(eventData);

            // ✅ Email the event creator
            var user = await _usersCollection.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user != null)
            {
                string subject = $"Your Event Has Been Created – {eventData.Name}";
                string body = $"Hi {user.FullName},\n\n" +
                              $"Your event \"{eventData.Name}\" has been successfully created on EventFinder!\n\n" +
                              $"📅 Date: {eventData.Date}\n" +
                              $"📍 Location: {eventData.Location}\n\n" +
                              $"You can manage, edit, or delete your event at any time.\n\n– EventFinder Team";

                await emailService.SendEmailAsync(user.Email, subject, body);
            }

            return Ok(new { message = "Event created successfully!", eventId = eventData.Id });
        }



        [HttpGet]
        public async Task<IActionResult> GetEvents()
        {
            List<Event> events = await _eventsCollection.Find(_ => true).ToListAsync();
            return Ok(events);
        }

        //gets event by ID /api/events/{id})
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEventById(string id)
        {
            Event eventItem = await _eventsCollection.Find(e => e.Id == id).FirstOrDefaultAsync();

            if (eventItem == null)
            {
                return NotFound("Event not found.");
            }

            return Ok(eventItem);
        }

        //searches for event based off category location date (GET /api/events/search?category=Music&location=NYC)
        [HttpGet("search")]
        public async Task<IActionResult> SearchEvents([FromQuery] string? category, [FromQuery] string? location, [FromQuery] DateTime? date)
        {
            var filter = Builders<Event>.Filter.Empty;

            if (!string.IsNullOrEmpty(category))
            {
                filter &= Builders<Event>.Filter.AnyEq(e => e.Categories, category);
            }

            if (!string.IsNullOrEmpty(location))
            {
                filter &= Builders<Event>.Filter.Eq(e => e.Location, location);
            }

            if (date.HasValue)
            {
                filter &= Builders<Event>.Filter.Eq(e => e.Date, date.Value);
            }

            List<Event> events = await _eventsCollection.Find(filter).ToListAsync();
            return Ok(events);
        }

        [Authorize]
        [HttpPost("{eventId}/rsvp")]
        public async Task<IActionResult> RSVPToEvent(string eventId, [FromBody] int tickets, [FromServices] SmtpEmailService emailService)
        {
            Console.WriteLine($"[DEBUG] Event ID: {eventId}");
            Console.WriteLine($"[DEBUG] Tickets Received: {tickets}");
            //testing logs 

            var userId = User.FindFirst("sub")?.Value;

            // 🔹 If 'sub' is missing, try 'nameidentifier'
            if (string.IsNullOrEmpty(userId))
            {
                Console.WriteLine("[ERROR] No 'sub' claim found. Checking alternative claim names...");
                userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            }

            if (string.IsNullOrEmpty(userId))
            {
                Console.WriteLine("[ERROR] User ID STILL NOT FOUND");
                return Unauthorized("Invalid token. User not found.");
            }

            Console.WriteLine($"[DEBUG] Extracted User ID: {userId}");

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Invalid token. User not found.");

            var eventItem = await _eventsCollection.Find(e => e.Id == eventId).FirstOrDefaultAsync(); // Searching DB for event with same ID
            if (eventItem == null)
                return NotFound(new { message = "Event not found." });

            if (tickets <= 0)
                return BadRequest(new { message = "You must reserve at least one ticket." });

            if (tickets > eventItem.MaxTicketsPerUser)
                return BadRequest(new { message = $"You can only reserve up to {eventItem.MaxTicketsPerUser} tickets." });

            // 🔹 Calculate total reserved tickets manually
            int totalReservedTickets = 0;
            foreach (var attendee in eventItem.Attendees)
            {
                totalReservedTickets += attendee.TicketsReserved;
            }

            // 🔹 Manually search for an existing RSVP
            RSVPEntry existingRSVP = null;
            foreach (var attendee in eventItem.Attendees)
            {
                if (attendee.UserId == userId)
                {
                    existingRSVP = attendee;
                    break;
                }
            }

            // 🔹 If RSVP exists, update the ticket count with proper adjustment
            if (existingRSVP != null)
            {
                int oldTicketCount = existingRSVP.TicketsReserved;
                int ticketDifference = tickets - oldTicketCount; // Calculate the difference

                if (totalReservedTickets + ticketDifference > eventItem.Capacity)
                    return BadRequest(new { message = "Not enough seats available." });

                existingRSVP.TicketsReserved = tickets; // Update ticket count correctly
            }
            else
            {
                // 🔹 Check event capacity before adding new RSVP
                if (totalReservedTickets + tickets > eventItem.Capacity)
                    return BadRequest(new { message = "Not enough seats available." });

                RSVPEntry newRSVP = new RSVPEntry
                {
                    UserId = userId,
                    TicketsReserved = tickets
                };
                eventItem.Attendees.Add(newRSVP);
            }

            await _eventsCollection.ReplaceOneAsync(e => e.Id == eventId, eventItem);

            // 🔹 Get the user so we can email them
            var user = await _usersCollection.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user != null)
            {
                string subject = $"RSVP Confirmation - {eventItem.Name}";
                string body = $"Hi {user.FullName},\n\nYou have successfully reserved {tickets} ticket(s) for the event \"{eventItem.Name}\" on {eventItem.Date} at {eventItem.Location}.\n\nThank you,\nEventFinder Team";

                await emailService.SendEmailAsync(user.Email, subject, body);
            }

            //Notify the event creator if they are not the one RSVPing
            if (eventItem.CreatedBy != userId)
            {
                var creator = await _usersCollection.Find(u => u.Id == eventItem.CreatedBy).FirstOrDefaultAsync();
                if (creator != null)
                {
                    string creatorSubject = $"New RSVP for Your Event – {eventItem.Name}";
                    string creatorBody = $"Hi {creator.FullName},\n\n" +
                                         $"{user.FullName} has just RSVP’d to your event \"{eventItem.Name}\" and reserved {tickets} ticket(s).\n\n" +
                                         "You can view all attendees anytime in your EventFinder dashboard.\n\n– EventFinder Team";

                    await emailService.SendEmailAsync(creator.Email, creatorSubject, creatorBody);
                }
            }
            return Ok(new { message = "RSVP successful! Confirmation email sent.", ticketsReserved = tickets });

        }

        [Authorize]
        [HttpDelete("{eventId}/rsvp")]
        public async Task<IActionResult> CancelRSVP(string eventId, [FromServices] SmtpEmailService emailService)
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

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Invalid token. User not found.");

            var eventItem = await _eventsCollection.Find(e => e.Id == eventId).FirstOrDefaultAsync();
            if (eventItem == null)
                return NotFound(new { message = "Event not found." });

            // 🔹 Check if the user has RSVP'd
            var existingRSVP = eventItem.Attendees.FirstOrDefault(a => a.UserId == userId);
            if (existingRSVP == null)
                return BadRequest(new { message = "You have not RSVP'd for this event." });

            // 🔹 Remove the RSVP entry from the list
            eventItem.Attendees.Remove(existingRSVP);

            // 🔹 Update the event in the database
            await _eventsCollection.ReplaceOneAsync(e => e.Id == eventId, eventItem);

            // ✅ Get user from DB
            var user = await _usersCollection.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user != null)
            {
                string subject = $"RSVP Cancelled - {eventItem.Name}";
                string body = $"Hi {user.FullName},\n\nYou've successfully cancelled your RSVP for \"{eventItem.Name}\" scheduled on {eventItem.Date} at {eventItem.Location}.\n\nWe're sorry to see you go!\n\nEventFinder Team";

                await emailService.SendEmailAsync(user.Email, subject, body);
            }

            return Ok(new { message = "RSVP cancelled successfully. Confirmation email sent." });
        }

        [Authorize]
        [HttpGet("{eventId}/attendees")]
        public async Task<IActionResult> GetAttendees(string eventId)
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

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Invalid token. User not found.");

            var eventItem = await _eventsCollection.Find(e => e.Id == eventId).FirstOrDefaultAsync();
            if (eventItem == null)
                return NotFound(new { message = "Event not found." });

            // 🔹 Only allow event creator to view the attendees
            if (eventItem.CreatedBy != userId)
                return StatusCode(403, new { message = "Only the event creator can view attendees." });


            return Ok(eventItem.Attendees);
        }

        [Authorize]
        [HttpGet("myevents")]
        public async Task<IActionResult> GetMyEvents()
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

            //gets events created by the logged-in user
            var myEvents = await _eventsCollection.Find(e => e.CreatedBy == userId).ToListAsync();

            return Ok(myEvents);
        }

        [Authorize]
        [HttpPut("{eventId}")]
        public async Task<IActionResult> UpdateEvent(string eventId, [FromBody] Event updatedEvent, [FromServices] SmtpEmailService emailService)
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

            // 🔹 Find the event in the database
            var eventItem = await _eventsCollection.Find(e => e.Id == eventId).FirstOrDefaultAsync();
            if (eventItem == null)
            {
                return NotFound(new { message = "Event not found." });
            }

            // 🔹 Ensure only the event creator can update the event
            if (eventItem.CreatedBy != userId)
            {
                return Forbid();
            }

            // 🔹 Apply updates (keep the same event ID)
            eventItem.Name = updatedEvent.Name ?? eventItem.Name;
            eventItem.Description = updatedEvent.Description ?? eventItem.Description;
            eventItem.Location = updatedEvent.Location ?? eventItem.Location;
            eventItem.Date = updatedEvent.Date != default ? updatedEvent.Date : eventItem.Date;
            eventItem.Categories = updatedEvent.Categories ?? eventItem.Categories;
            eventItem.Capacity = updatedEvent.Capacity != default ? updatedEvent.Capacity : eventItem.Capacity;
            eventItem.IsPublic = updatedEvent.IsPublic;

            await _eventsCollection.ReplaceOneAsync(e => e.Id == eventId, eventItem);

            //Notify RSVP'd users
            foreach (var attendee in eventItem.Attendees)
            {
                var user = await _usersCollection.Find(u => u.Id == attendee.UserId).FirstOrDefaultAsync();
                if (user != null)
                {
                    string subject = $"Update: {eventItem.Name} has been changed";
                    string body = $"Hi {user.FullName},\n\nThe event you RSVP’d to, \"{eventItem.Name}\", has been updated.\n\n" +
                                  $"New Details:\n📍 Location: {eventItem.Location}\n📅 Date: {eventItem.Date}\n\n" +
                                  $"Please check the event for full details.\n\n- EventFinder Team";

                    await emailService.SendEmailAsync(user.Email, subject, body);
                }
            }

            return Ok(new { message = "Event updated successfully! Attendees notified.", updatedEvent });
        }

        [Authorize]
        [HttpDelete("{eventId}")]
        public async Task<IActionResult> DeleteEvent(string eventId, [FromServices] SmtpEmailService emailService)
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

            // 🔹 Find the event in the database
            var eventItem = await _eventsCollection.Find(e => e.Id == eventId).FirstOrDefaultAsync();
            if (eventItem == null)
            {
                return NotFound(new { message = "Event not found." });
            }

            // 🔹 Ensure only the event creator can delete the event
            if (eventItem.CreatedBy != userId)
            {
                return Forbid();
            }

            //Notify all RSVP'd users before deleting
            foreach (var attendee in eventItem.Attendees)
            {
                var user = await _usersCollection.Find(u => u.Id == attendee.UserId).FirstOrDefaultAsync();
                if (user != null)
                {
                    string subject = $"Event Cancellation: {eventItem.Name}";
                    string body = $"Hi {user.FullName},\n\nWe regret to inform you that the event \"{eventItem.Name}\", which was scheduled on {eventItem.Date} at {eventItem.Location}, has been canceled by the event organizer.\n\n" +
                                  $"We apologize for the inconvenience.\n\n- EventFinder Team";

                    await emailService.SendEmailAsync(user.Email, subject, body);
                }
            }

            //delete the event
            await _eventsCollection.DeleteOneAsync(e => e.Id == eventId);

            return Ok(new { message = "Event deleted successfully! Attendees notified." });
        }

        private async Task<(double lat, double lng)?> GeocodeLocationAsync(string location)
        {
            using var httpClient = new HttpClient();
            string mapboxToken = "pk.eyJ1IjoiemFpbjIxMDNhIiwiYSI6ImNtOWtwM2dncDBmaW0ya3Nnd3BlaHg1djAifQ.rVKwmgGfMUYyPBmfpeV2tA"; // Replace with your token or fetch from config

            var url = $"https://api.mapbox.com/geocoding/v5/mapbox.places/{Uri.EscapeDataString(location)}.json?access_token={mapboxToken}";

            var response = await httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync();
            var data = JsonDocument.Parse(json);

            var coords = data.RootElement
                .GetProperty("features")[0]
                .GetProperty("geometry")
                .GetProperty("coordinates");

            double lng = coords[0].GetDouble();
            double lat = coords[1].GetDouble();

            return (lat, lng);
        }
    }
}

