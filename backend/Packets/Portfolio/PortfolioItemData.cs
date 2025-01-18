using Enums;

namespace Packets.Portfolio
{
    public class PortfolioItemData
    {
        public FileType Type { get; set; }
        public IFormFile? File { get; set; }
        public string? GithubRepo { get; set; }
    }
}