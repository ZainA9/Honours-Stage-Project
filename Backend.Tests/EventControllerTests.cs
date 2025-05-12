using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Xunit;
using Moq;
using FluentAssertions;
using MongoDB.Driver;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using EventFinderAPI.Controllers;
using EventFinderAPI.Models;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;


//public class EventControllerTests
//{
//    [Fact]
//    public async Task RSVPToEvent_ReturnsOk_WhenInputIsValid()
//    {
//        // Arrange
//        var mockEventsCollection = new Mock<IMongoCollection<Event>>();
//        var mockUsersCollection = new Mock<IMongoCollection<User>>();
//        var mockEmailService = new Mock<SmtpEmailService>(MockBehavior.Loose, (IConfiguration)null);

//        var sampleEvent = new Event
//        {
//            Id = "123",
//            Name = "Mock Event",
//            Location = "Test Location",
//            Date = System.DateTime.Now,
//            MaxTicketsPerUser = 5,
//            Capacity = 100,
//            CreatedBy = "creator123",
//            Attendees = new List<RSVPEntry>()
//        };

//        var mockFindFluent = new Mock<IFindFluent<Event, Event>>();
//        mockFindFluent.Setup(m => m.FirstOrDefaultAsync(default)).ReturnsAsync(sampleEvent);

//        mockEventsCollection
//            .Setup(x => x.Find(It.IsAny<FilterDefinition<Event>>(), null))
//            .Returns(mockFindFluent.Object);

//        //var controller = new EventController(mockEventsCollection.Object, mockUsersCollection.Object);


//        controller.ControllerContext = new ControllerContext
//        {
//            HttpContext = new DefaultHttpContext
//            {
//                User = new System.Security.Claims.ClaimsPrincipal(
//                    new System.Security.Claims.ClaimsIdentity(
//                        new[] { new System.Security.Claims.Claim("sub", "user456") }
//                    )
//                )
//            }
//        };

//        // Act
//        var result = await controller.RSVPToEvent("123", 2, mockEmailService.Object);

//        // Assert
//        var ok = Assert.IsType<OkObjectResult>(result);
//        Assert.Equal(200, ok.StatusCode ?? 200);
//    }
//}