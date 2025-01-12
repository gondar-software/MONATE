using Databases.UserData;
using Enums;

namespace Databases.EndpointData
{
    public class Commit
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int EndpointId { get; set; }
        public int WorkflowId { get; set; }
        public int RootCommitId { get; set; }
        public string Text { get; set; } = "";
        public CommitType Type { get; set; }

        public User? User { get; set; }
        public Endpoint? Endpoint { get; set; }
        public Workflow? Workflow { get; set; }
        public Commit? RootCommit { get; set; }
        public ICollection<Commit>? NodeCommits { get; set; }
    }
}