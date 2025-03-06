using Enums;

namespace Databases.PortfolioData
{
    public class PortfolioItem
    {
        public int Id { get; set; }
        public int PortfolioId { get; set; }
        public FileType Type { get; set; }
        public string Path { get; set; } = "";

        public Portfolio? Portfolio { get; set; }
    }
}