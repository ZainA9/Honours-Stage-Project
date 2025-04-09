using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using EventFinderAPI.Models;
using EventFinderAPI.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using MongoDB.Bson;

namespace EventFinderAPI.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IMongoCollection<User> _usersCollection;
        private readonly IConfiguration _config;

        public AuthController(MongoDBService mongoDBService, IConfiguration config)
        {
            _usersCollection = mongoDBService.GetCollection<User>(config["DatabaseSettings:UsersCollectionName"]);
            _config = config;
        }

        //signup endpoint (POST /api/auth/register) 
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (string.IsNullOrEmpty(user.FullName) || string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.PasswordHash))
            {
                return BadRequest("Full Name, Email, and Password are required.");
            }

            //Checking if email is already in use
            var existingUser = await _usersCollection.Find(u => u.Email == user.Email).FirstOrDefaultAsync();
            if (existingUser != null)
            {
                return BadRequest("Email is already registered.");
            }

            //hash password before saving
            user.Id = ObjectId.GenerateNewId().ToString(); // 🔹 Ensure user ID is set before inserting jus addeed
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);

            await _usersCollection.InsertOneAsync(user);
            Console.WriteLine($"[DEBUG] User Registered with ID: {user.Id}");
            return Ok(new { message = "User registered successfully!" });
        }

        //login endpoint (POST /api/auth/login)
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            var existingUser = await _usersCollection.Find(u => u.Email == loginRequest.Email).FirstOrDefaultAsync();
            if (existingUser == null || !BCrypt.Net.BCrypt.Verify(loginRequest.Password, existingUser.PasswordHash))
            {
                return Unauthorized("Invalid email or password.");
            }

            var token = GenerateJwtToken(existingUser);
            return Ok(new { token });
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _config.GetSection("JwtSettings");
            var secret = jwtSettings["Secret"];

            if (string.IsNullOrEmpty(secret))
            {
                throw new Exception("JWT Secret key is missing in appsettings.json");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));

            var claims = new[]
            {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id), // 🔹 Ensure this correctly stores user ID
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim("FullName", user.FullName)
    };

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                jwtSettings["Issuer"],
                jwtSettings["Audience"],
                claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["ExpiryMinutes"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        [HttpGet("test-jwt")]
        public IActionResult TestJwt()
        {
            var jwtSettings = _config.GetSection("JwtSettings");
            var secret = jwtSettings["Secret"];

            if (string.IsNullOrEmpty(secret))
            {
                return BadRequest("JWT Secret key is missing in appsettings.json");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));

            var testClaims = new[]
            {
        new Claim(JwtRegisteredClaimNames.Sub, "TestUserId"),
        new Claim(JwtRegisteredClaimNames.Email, "test@example.com")
    };

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                jwtSettings["Issuer"],
                jwtSettings["Audience"],
                testClaims,
                expires: DateTime.UtcNow.AddMinutes(5),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            // Now try to validate the token immediately
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateIssuer = true,
                ValidIssuer = jwtSettings["Issuer"],
                ValidateAudience = true,
                ValidAudience = jwtSettings["Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            try
            {
                tokenHandler.ValidateToken(tokenString, validationParameters, out var validatedToken);
                return Ok(new { Token = tokenString, Message = "JWT signing and verification is working correctly!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message, Token = tokenString });
            }
        }


        //generate JWT Token
        //private string GenerateJwtToken(User user)
        //{
        //    var jwtSettings = _config.GetSection("JwtSettings");
        //    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]));

        //    // 🔹 Debugging log
        //    Console.WriteLine($"[DEBUG] Generating JWT Token for User ID: {user.Id}");

        //    if (string.IsNullOrEmpty(user.Id))
        //    {
        //        throw new Exception("User ID is null when generating JWT Token.");
        //    }


        //    var claims = new[] //claims store user info in token
        //    {
        //        new Claim(JwtRegisteredClaimNames.Sub, user.Id),
        //        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        //        new Claim("FullName", user.FullName)
        //    };

        //    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256); //sign the token with security algorithm 
        //    var token = new JwtSecurityToken(
        //        jwtSettings["Issuer"],
        //        jwtSettings["Audience"],
        //        claims,
        //        expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["ExpiryMinutes"])),
        //        signingCredentials: creds
        //    );

        //    return new JwtSecurityTokenHandler().WriteToken(token);
        //}

    }

}
