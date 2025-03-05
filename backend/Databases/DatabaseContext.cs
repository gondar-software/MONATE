using Databases.PortfolioData;
using Databases.ComfyUIData;
using Databases.UserData;
using Databases.ChatbotData;
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
        public DbSet<Information> Informations { get; set; } = null!;
        #endregion

        #region PortfolioTable
        public DbSet<Portfolio> Portfolios { get; set; } = null!;
        public DbSet<PortfolioItem> PortfolioItems { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        #endregion

        #region ChatbotTables
        public DbSet<ChatbotHistory> ChatbotHistories { get; set; } = null!;
        public DbSet<ChatbotCache> ChatbotCaches { get; set; } = null!;
        #endregion

        #region ComfyUITables
        public DbSet<ComfyUIInputParam> ComfyUIInputParams { get; set; } = null!;
        public DbSet<ComfyUIOutputParam> ComfyUIOutputParams { get; set; } = null!;
        public DbSet<ComfyUIWork> ComfyUIWorks { get; set; } = null!;
        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            ConfigureUserTables(modelBuilder);
            ConfigurePortfolioTables(modelBuilder);
            ConfigureChatbotTables(modelBuilder);
            ConfigureComfyUITables(modelBuilder);
        }

        private void ConfigureUserTables(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Information>()
                .HasOne(i => i.User)
                .WithOne(u => u.Information)
                .HasForeignKey<Information>(i => i.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        private void ConfigurePortfolioTables(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PortfolioItem>()
                .HasOne(p => p.Portfolio)
                .WithMany(p => p.Items)
                .HasForeignKey(p => p.PortfolioId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Category>()
                .HasMany(c => c.Portfolios)
                .WithMany(c => c.Categories);
        }

        private void ConfigureChatbotTables(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ChatbotHistory>()
                .HasOne(c => c.User)
                .WithMany(u => u.ChatbotHistories)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<ChatbotCache>()
                .HasOne(c => c.User)
                .WithOne(u => u.ChatbotCache)
                .HasForeignKey<ChatbotCache>(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        private void ConfigureComfyUITables(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ComfyUIInputParam>()
                .HasOne(c => c.Work)
                .WithMany(c => c.Inputs)
                .HasForeignKey(c => c.WorkId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<ComfyUIOutputParam>()
                .HasOne(c => c.Work)
                .WithOne(c => c.Output)
                .HasForeignKey<ComfyUIOutputParam>(c => c.WorkId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<ComfyUIWork>()
                .HasOne(c => c.User)
                .WithMany(u => u.ComfyUIWorks)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
