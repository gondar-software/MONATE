using Databases.UserData;
using Enums;

namespace Databases.ComfyUIData
{
    public class ComfyUIWork
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public ComfyUIModelTypes Type { get; set; }

        public User? User { get; set; } 
        public ICollection<ComfyUIInputData>? Inputs { get; set; }
        public ComfyUIOutputData? Output { get; set; }
    }
}
