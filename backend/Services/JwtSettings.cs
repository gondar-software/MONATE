namespace Services
{
    public class JwtSettings
    {
        public string Key { get; set; } = "";
        public string Issuer { get; set; } = "";
        public string Audience { get; set; } = "";
        public int ExpireInMinutes { get; set; } = 0;

        public static void GetJwtSettings(JwtSettings options)
        {
            options.Key = Environment.GetEnvironmentVariable("JWT_KEY") ?? "";
            options.Issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "";
            options.Audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "";
            options.ExpireInMinutes = int.Parse(Environment.GetEnvironmentVariable("JWT_EXPIRE_IN_MINUTES") ?? "0");
        }
    }
}