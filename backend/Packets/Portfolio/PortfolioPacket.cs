using Databases.EndpointData;
using Enums;

namespace Packets.Portfolio
{
    public class PortfolioPacket
    {
        public PortfolioType Type { get; set; }
        public string Name { get; set; } = "";
        public string? Url { get; set; }
        public List<Category>? Categories { get; set; }
        public List<PortfolioItemData>? Items { get; set; }
    }
}