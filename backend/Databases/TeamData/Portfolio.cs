using Databases.EndpointData;
using Enums;

namespace Databases.TeamData
{
    public class Portfolio
    {
        public int Id { get; set; }
        public PortfolioType Type { get; set; }
        public string Name { get; set; } = "";
        public string? Url { get; set; }
        
        public ICollection<Category>? Categories { get; set; }
        public ICollection<PortfolioItem>? Items { get; set; }
    }
}