using Microsoft.AspNetCore.Mvc;

namespace EventFinderAPI.Controllers
{
    [Route("api/categories")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetCategories()
        {
            List<string> categories = new List<string> //allowing users to categorize their events
            {
                "Music",
                "Technology",
                "Sports",
                "Art",
                "Networking",
                "Education",
                "Health & Wellness",
                "Food & Drink",
                "Business",
                "Gaming"
            };

            return Ok(categories);
        }
    }
}
