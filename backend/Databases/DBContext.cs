using System.Threading.Channels;
using Databases.CommunicationData;
using Databases.EcommerceData;
using Databases.EndpointData;
using Databases.UserData;
using Microsoft.EntityFrameworkCore;

namespace Databases
{
    public class DBContext: DbContext
    {
        public DBContext(DbContextOptions<DBContext> options) : base(options) 
        {
        }

        #region UserTables
        public DbSet<User> Users { get; set; }
        public DbSet<API> APIs { get; set; }
        public DbSet<Certification> Certifications { get; set; }
        public DbSet<Education> Educations { get; set; }
        public DbSet<Experience> Experiences { get; set; }
        public DbSet<Information> Informations { get; set; }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<Relation> Relations { get; set; }
        #endregion

        #region EndpointTables
        public DbSet<EndpointData.Endpoint> Endpoints { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Input> Inputs { get; set; }
        public DbSet<Workflow> Workflows { get; set; }
        #endregion

        #region EcommerceTables
        public DbSet<EthAddress> EthAddresses { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        #endregion

        #region CommunicationData
        public DbSet<CommunicationData.Channel> Channels { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Mail> Mails { get; set; }
        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<API>()
                .HasOne(a => a.User)
                .WithMany(u => u.APIs)
                .HasForeignKey(a => a.UserId);
            modelBuilder.Entity<Certification>()
                .HasOne(c => c.Profile)
                .WithMany(p => p.Certifications)
                .HasForeignKey(c => c.ProfileId);
            modelBuilder.Entity<Certification>()
                .HasOne(c => c.Education)
                .WithMany(e => e.Certifications)
                .HasForeignKey(c => c.EducationId);
            modelBuilder.Entity<Certification>()
                .HasMany(c => c.Categories)
                .WithMany(c => c.Certifications);
            modelBuilder.Entity<Education>()
                .HasOne(e => e.Profile)
                .WithMany(p => p.Educations)
                .HasForeignKey(e => e.ProfileId);
            modelBuilder.Entity<Education>()
                .HasMany(e => e.Categories)
                .WithMany(c => c.Educations);
            modelBuilder.Entity<Experience>()
                .HasOne(e => e.Profile)
                .WithMany(p => p.Experiences)
                .HasForeignKey(e => e.ProfileId);
            modelBuilder.Entity<Experience>()
                .HasMany(e => e.Categories)
                .WithMany(c => c.Experiences);
            modelBuilder.Entity<Information>()
                .HasOne(i => i.User)
                .WithOne(u => u.Information)
                .HasForeignKey<Information>(i => i.UserId);
            modelBuilder.Entity<Relation>()
                .HasOne(r => r.OwnerUser)
                .WithMany(u => u.OwningRelations)
                .HasForeignKey(r => r.OwnerUserId);
            modelBuilder.Entity<Relation>()
                .HasOne(r => r.OwnedUser)
                .WithMany(u => u.OwnedRelations)
                .HasForeignKey(r => r.OwnedUserId);
            modelBuilder.Entity<Profile>()
                .HasMany(p => p.Skills)
                .WithMany(c => c.Profiles);
            modelBuilder.Entity<Profile>()
                .HasOne(p => p.User)
                .WithOne(u => u.Profile)
                .HasForeignKey<Profile>(p => p.UserId);
            modelBuilder.Entity<EndpointData.Endpoint>()
                .HasOne(e => e.Profile)
                .WithMany(p => p.Endpoints)
                .HasForeignKey(e => e.ProfileId);
            modelBuilder.Entity<EndpointData.Endpoint>()
                .HasMany(e => e.Categories)
                .WithMany(c => c.Endpoints);
            modelBuilder.Entity<Input>()
                .HasOne(i => i.Workflow)
                .WithMany(w => w.Inputs)
                .HasForeignKey(i => i.WorkflowId);
            modelBuilder.Entity<Workflow>()
                .HasOne(w => w.Endpoint)
                .WithMany(e => e.Workflows)
                .HasForeignKey(w => w.EndpointId);
            modelBuilder.Entity<EthAddress>()
                .HasOne(e => e.User)
                .WithMany(u => u.EthAddresses)
                .HasForeignKey(e => e.UserId);
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.User)
                .WithMany(u => u.Transactions)
                .HasForeignKey(t => t.UserId);
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.EthAddress)
                .WithMany(e => e.Transactions)
                .HasForeignKey(t => t.EthAddressId);
            modelBuilder.Entity<CommunicationData.Channel>()
                .HasMany(c => c.Users)
                .WithMany(u => u.Channels);
            modelBuilder.Entity<Chat>()
                .HasOne(c => c.SenderUser)
                .WithMany(u => u.SentChats)
                .HasForeignKey(c => c.SenderUserId);
            modelBuilder.Entity<Chat>()
                .HasOne(c => c.ReceiverUser)
                .WithMany(u => u.ReceivedChats)
                .HasForeignKey(c => c.ReceiverUserId);
            modelBuilder.Entity<Chat>()
                .HasOne(c => c.Channel)
                .WithMany(c => c.Chats)
                .HasForeignKey(c => c.ChannelId);
            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.User)
                .WithMany(u => u.Feedbacks)
                .HasForeignKey(f => f.UserId);
            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.Endpoint)
                .WithMany(e => e.Feedbacks)
                .HasForeignKey(f => f.EndpointId);
            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.Workflow)
                .WithMany(w => w.Feedbacks)
                .HasForeignKey(f => f.WorkflowId);
            modelBuilder.Entity<Mail>()
                .HasOne(m => m.SenderUser)
                .WithMany(u => u.SentMails)
                .HasForeignKey(m => m.SenderUserId);
            modelBuilder.Entity<Mail>()
                .HasOne(m => m.ReceiverUser)
                .WithMany(u => u.ReceivedMails)
                .HasForeignKey(m => m.ReceiverUserId);
        }
    }
}
