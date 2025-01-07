using Enums;

namespace Databases.UserData
{
    public class Relation
    {
        public int Id { get; set; }
        public RelationType Type { get; set; }
        public int OwnerUserId { get; set; }
        public int OwnedUserId { get; set; }

        public User? OwnerUser { get; set; }
        public User? OwnedUser { get; set; }
    }
}