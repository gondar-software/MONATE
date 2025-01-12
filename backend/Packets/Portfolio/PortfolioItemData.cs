using Enums;

namespace Packets.Portfolio
{
    public class PortfolioItemData
    {
        public PortfolioItemType Type { get; set; }
        public string Value { get; set; } = "";
    }
}