namespace Services
{
    public class JwtSettings
    {
        public string Key { get; set; } = "";
        public string Issuer { get; set; } = "";
        public string Audience { get; set; } = "";
        public int ExpireInMinutes { get; set; } = 0;

        public static JwtSettings GetJwtSettings()
        {
            return new JwtSettings
            {
                Key = Environment.GetEnvironmentVariable("JWT_KEY") ?? "",
                Issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "",
                Audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "",
                ExpireInMinutes = int.Parse(Environment.GetEnvironmentVariable("JWT_EXPIRE_IN_MINUTES") ?? "0"),
            };
        }
    }
}