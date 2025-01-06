namespace Exceptions
{
    public class NetworkErrorException : Exception
    {
        public NetworkErrorException(string? message) : base(message) { }
    }
}