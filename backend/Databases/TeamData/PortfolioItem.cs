using Enums;

namespace Databases.TeamData
{
    public class PortfolioItem
    {
        public int Id { get; set; }
        public int PortfolioId { get; set; }
        public PortfolioItemType Type { get; set; }
        public string Value { get; set; } = "";

        public Portfolio? Portfolio { get; set; }
    }
}