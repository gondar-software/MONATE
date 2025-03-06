namespace Databases.PortfolioData
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string? Description { get; set; }

        public ICollection<Portfolio>? Portfolios { get; set; }
    }
}