using Helpers;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

DotEnvHelper.Load();
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") ?? "";

builder.Services.AddSingleton(new CryptionHelper());

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddDbContext<Databases.DatabaseContext>(options =>
{
    options.UseNpgsql(connectionString);
});

var app = builder.Build();

app.UseMiddleware<Middlewares.CryptionMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();