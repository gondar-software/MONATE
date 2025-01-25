namespace Services
{
    public static class JwtSettings
    {
        public static string Key => Environment.GetEnvironmentVariable("JWT_KEY") ?? "";
        public static string Issuer => Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "";
        public static string Audience => Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "";
        public static int ExpireInMinutes => int.Parse(Environment.GetEnvironmentVariable("JWT_EXPIRE_IN_MINUTES") ?? "0");
    }
}