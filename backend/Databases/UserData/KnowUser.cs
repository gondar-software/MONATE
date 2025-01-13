using Enums;

namespace Databases.UserData
{
    public class KnowUser
    {
        public int Id { get; set; }
        public int MeId { get; set; }
        public int YouId { get; set; }
        public FavouriteType Favourite { get; set; }
        public UserShowingType ShowingType { get; set; }

        public User? Me { get; set; }
        public User? You { get; set; }
    }
}