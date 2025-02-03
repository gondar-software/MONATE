using Enums;

namespace Packets.Portfolio
{
    public class PortfolioItemData
    {
        public FileType Type { get; set; }
        public string Path { get; set; } = "";
    }
}