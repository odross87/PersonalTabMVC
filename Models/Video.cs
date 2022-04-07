using Microsoft.AspNetCore.Http;

namespace PersonalTabMVC.Models
{
    public class Video
    {
        public IFormFile VideoRaw { get; set; }
        public int Id { get; set; }
    }
}
