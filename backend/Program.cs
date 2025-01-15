using Helpers;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

DotEnvHelper.Load();
var keyPath = Environment.GetEnvironmentVariable("KEY_PATH") ?? "";
var keyPassword = Environment.GetEnvironmentVariable("KEY_PASSWORD") ?? "";
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") ?? "";

builder.Services.AddControllers();

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ConfigureHttpsDefaults(options =>
    {
        options.ServerCertificate = new System.Security.Cryptography.X509Certificates.X509Certificate2(keyPath, keyPassword);
        options.SslProtocols = System.Security.Authentication.SslProtocols.Tls12 | System.Security.Authentication.SslProtocols.Tls13;
    });
});

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddDbContext<Databases.DatabaseContext>(options =>
{
    options.UseNpgsql(connectionString);
});

var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();