using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Services;

var builder = WebApplication.CreateBuilder(args);

Helpers.DotEnvHelper.Load();
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") ?? "";

builder.Services.AddSingleton(new Helpers.CryptionHelper());

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddHttpClient();

builder.Services.AddDbContext<Databases.DatabaseContext>(options =>
{
    options.UseNpgsql(connectionString);
});

builder.Services.AddScoped<JwtService>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = JwtSettings.Issuer,
            ValidAudience = JwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(JwtSettings.Key)
            ),
        };
    });

var app = builder.Build();

app.UseMiddleware<Middlewares.CryptionMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();