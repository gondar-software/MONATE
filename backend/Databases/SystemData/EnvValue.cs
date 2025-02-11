using Enums;

namespace Databases.SystemData
{
    public class EnvValue
    {
        public int Id { get; set; }
        public EnvType Type { get; set; }
        public string Value { get; set; } = "";
    }
}
