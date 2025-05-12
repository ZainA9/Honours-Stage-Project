using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using EventFinderAPI.Models;

namespace Backend.Tests
{
    public class EventTests
    {
        [Fact]
        public void CanCreateEvent_WithValidData()
        {
            // Arrange
            var evt = new Event
            {
                Name = "Tech Conference",
                Description = "Annual Tech Meetup",
                Location = "London",
                Date = DateTime.Now.AddDays(5),
                Categories = new[] { "Technology" },
                Capacity = 100,
                Price = 0,
                IsPublic = true,
                MaxTicketsPerUser = 3
            };

            // Assert
            Assert.Equal("Tech Conference", evt.Name);
            Assert.Equal("London", evt.Location);
            Assert.Equal(100, evt.Capacity);
            Assert.True(evt.IsPublic);
            Assert.NotNull(evt.Categories);
        }
    }
}
