using Helpers;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

DotEnvHelper.Load();

builder.Services.AddControllers();

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ConfigureHttpsDefaults(options =>
    {
        options.SslProtocols = System.Security.Authentication.SslProtocols.Tls12 | System.Security.Authentication.SslProtocols.Tls13;
    });
});

builder.Services.AddEndpointsApiExplorer();

var connectionString = builder.Configuration.GetConnectionString("Database");
builder.Services.AddDbContext<Databases.DatabaseContext>(options =>
{
    options.UseNpgsql(connectionString);
});

var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();