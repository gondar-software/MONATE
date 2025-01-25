namespace Enums
{
    public enum ErrorType : int
    {
        Unknown = 501,
        UserNotFound = 502,
        UserAlreadyExists = 503,
        UserPending = 504,
        UserSuspended = 505,
        VerificationCodeExpired = 506,
        VerificationCodeInvalid = 507,
        VerificationCodeTrialExceeded = 508,
        UserPasswordFailed = 509,
        PortfolioNotFound = 510,
    }
}