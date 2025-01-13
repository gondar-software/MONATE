using Database.TeamData;
using Databases.CommunicationData;
using Databases.EcommerceData;
using Databases.EndpointData;
using Databases.TeamData;
using Databases.UserData;
using Microsoft.EntityFrameworkCore;

namespace Databases
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) 
        {
        }

        #region UserTables
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<API> APIs { get; set; } = null!;
        public DbSet<Certification> Certifications { get; set; } = null!;
        public DbSet<Education> Educations { get; set; } = null!;
        public DbSet<Experience> Experiences { get; set; } = null!;
        public DbSet<Information> Informations { get; set; } = null!;
        public DbSet<KnowUser> KnowUsers { get; set; } = null!;
        public DbSet<Profile> Profiles { get; set; } = null!;
        public DbSet<Relation> Relations { get; set; } = null!;
        #endregion

        #region TeamTables
        public DbSet<Portfolio> Portfolios { get; set; } = null!;
        public DbSet<PortfolioItem> PortfolioItems { get; set; } = null!;
        public DbSet<Review> Reviews { get; set; } = null!;
        #endregion

        #region EndpointTables
        public DbSet<EndpointData.Endpoint> Endpoints { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Input> Inputs { get; set; } = null!;
        public DbSet<Workflow> Workflows { get; set; } = null!;
        #endregion

        #region EcommerceTables
        public DbSet<EthAddress> EthAddresses { get; set; } = null!;
        public DbSet<Transaction> Transactions { get; set; } = null!;
        #endregion

        #region CommunicationTables
        public DbSet<Channel> Channels { get; set; } = null!;
        public DbSet<Chat> Chats { get; set; } = null!;
        public DbSet<Feedback> Feedbacks { get; set; } = null!;
        public DbSet<Mail> Mails { get; set; } = null!;
        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            ConfigureUserTables(modelBuilder);
            ConfigureTeamTables(modelBuilder);
            ConfigureEndpointTables(modelBuilder);
            ConfigureEcommerceTables(modelBuilder);
            ConfigureCommunicationTables(modelBuilder);
        }

        private void ConfigureUserTables(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<API>()
                .HasOne(a => a.User)
                .WithMany(u => u.APIs)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Certification>()
                .HasOne(c => c.Profile)
                .WithMany(p => p.Certifications)
                .HasForeignKey(c => c.ProfileId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Certification>()
                .HasOne(c => c.Education)
                .WithMany(e => e.Certifications)
                .HasForeignKey(c => c.EducationId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Certification>()
                .HasMany(c => c.Categories)
                .WithMany(c => c.Certifications);
            modelBuilder.Entity<Education>()
                .HasOne(e => e.Profile)
                .WithMany(p => p.Educations)
                .HasForeignKey(e => e.ProfileId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Education>()
                .HasMany(e => e.Categories)
                .WithMany(c => c.Educations);
            modelBuilder.Entity<Experience>()
                .HasOne(e => e.Profile)
                .WithMany(p => p.Experiences)
                .HasForeignKey(e => e.ProfileId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Experience>()
                .HasMany(e => e.Categories)
                .WithMany(c => c.Experiences);
            modelBuilder.Entity<Information>()
                .HasOne(i => i.User)
                .WithOne(u => u.Information)
                .HasForeignKey<Information>(i => i.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Profile>()
                .HasOne(p => p.User)
                .WithOne(u => u.Profile)
                .HasForeignKey<Profile>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Profile>()
                .HasMany(p => p.Skills)
                .WithMany(c => c.Profiles);
            modelBuilder.Entity<Relation>()
                .HasOne(r => r.OwnerUser)
                .WithMany(u => u.OwnedRelations)
                .HasForeignKey(r => r.OwnerUserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Relation>()
                .HasOne(r => r.OwnedUser)
                .WithMany(u => u.OwningRelations)
                .HasForeignKey(r => r.OwnedUserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<KnowUser>()
                .HasOne(k => k.Me)
                .WithMany(u => u.KnewUsers)
                .HasForeignKey(k => k.MeId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<KnowUser>()
                .HasOne(k => k.You)
                .WithMany(u => u.KnownUsers)
                .HasForeignKey(k => k.YouId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        private void ConfigureTeamTables(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Portfolio>()
                .HasMany(p => p.Categories)
                .WithMany(c => c.Portfolios);
            modelBuilder.Entity<PortfolioItem>()
                .HasOne(p => p.Portfolio)
                .WithMany(p => p.Items)
                .HasForeignKey(p => p.PortfolioId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        private void ConfigureEndpointTables(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Commit>()
                .HasOne(c => c.User)
                .WithMany(u => u.Commits)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Commit>()
                .HasOne(c => c.Endpoint)
                .WithMany(e => e.Commits)
                .HasForeignKey(c => c.EndpointId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Commit>()
                .HasOne(c => c.Workflow)
                .WithMany(w => w.Commits)
                .HasForeignKey(c => c.WorkflowId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Commit>()
                .HasOne(c => c.RootCommit)
                .WithMany(c => c.NodeCommits)
                .HasForeignKey(c => c.RootCommitId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<EndpointData.Endpoint>()
                .HasOne(e => e.Profile)
                .WithMany(p => p.Endpoints)
                .HasForeignKey(e => e.ProfileId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<EndpointData.Endpoint>()
                .HasMany(e => e.Categories)
                .WithMany(c => c.Endpoints);
            modelBuilder.Entity<Input>()
                .HasOne(i => i.Workflow)
                .WithMany(w => w.Inputs)
                .HasForeignKey(i => i.WorkflowId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Workflow>()
                .HasOne(w => w.Endpoint)
                .WithMany(e => e.Workflows)
                .HasForeignKey(w => w.EndpointId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        private void ConfigureEcommerceTables(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<EthAddress>()
                .HasOne(e => e.User)
                .WithMany(u => u.EthAddresses)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.EthAddress)
                .WithMany(e => e.Transactions)
                .HasForeignKey(t => t.EthAddressId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.User)
                .WithMany(u => u.Transactions)
                .HasForeignKey(t => t.UserId);
        }

        private void ConfigureCommunicationTables(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Channel>()
                .HasMany(c => c.Users)
                .WithMany(u => u.Channels);
            modelBuilder.Entity<Chat>()
                .HasOne(c => c.SenderUser)
                .WithMany(u => u.SentChats)
                .HasForeignKey(c => c.SenderUserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Chat>()
                .HasOne(c => c.ReceiverUser)
                .WithMany(u => u.ReceivedChats)
                .HasForeignKey(c => c.ReceiverUserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Chat>()
                .HasOne(c => c.Channel)
                .WithMany(c => c.Chats)
                .HasForeignKey(c => c.ChannelId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.User)
                .WithMany(u => u.Feedbacks)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.Endpoint)
                .WithMany(e => e.Feedbacks)
                .HasForeignKey(f => f.EndpointId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.Workflow)
                .WithMany(w => w.Feedbacks)
                .HasForeignKey(f => f.WorkflowId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Mail>()
                .HasOne(m => m.SenderUser)
                .WithMany(u => u.SentMails)
                .HasForeignKey(m => m.SenderUserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Mail>()
                .HasOne(m => m.ReceiverUser)
                .WithMany(u => u.ReceivedMails)
                .HasForeignKey(m => m.ReceiverUserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
