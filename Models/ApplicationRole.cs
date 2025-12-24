using Microsoft.AspNetCore.Identity;

namespace Nexus.Services.Identity.Models
{
    public class ApplicationRole : IdentityRole
    {
        public string? Description { get; set; }
    }
}