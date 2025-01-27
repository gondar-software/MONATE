using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using Enums;

namespace Helpers
{
    public static class VerifyEmailHelper
    {
        private static readonly ConcurrentDictionary<string, string> VerifyCodeDict = new();
        private static readonly ConcurrentDictionary<string, int> VerifyTrialCountDict = new();
        private static readonly ConcurrentDictionary<string, DateTime> VerifyLastTrialDict = new();

        public static ErrorType? SendVerificationCode(string email, ILogger logger)
        {
            string code = GenerateRandom6DigitString();
            string subject = "Your Verification Code";
            string body = $"Welcome to MONATE website!!!\n\nYour verification code is: **{code}**.\n\nPlease enter this code to verify your account.\n\nThank you!";

            if (!VerifyTrialCounts(email))
                return ErrorType.VerificationCodeTrialExceeded;

            VerifyCodeDict[email] = code;

            logger.LogInformation(code);

            // SMTPHelper.SendEmail(email, subject, body, logger);

            return null;
        }

        public static ErrorType? VerifyEmail(string email, string code)
        {
            if (!VerifyTrialCounts(email))
                return ErrorType.VerificationCodeTrialExceeded;

            if (VerifyCodeDict.TryGetValue(email, out string? storedCode) && storedCode == code)
            {
                VerifyCodeDict.TryRemove(email, out _);
                VerifyTrialCountDict.TryRemove(email, out _);
                VerifyLastTrialDict.TryRemove(email, out _);
                return null;
            }

            return ErrorType.VerificationCodeInvalid;
        }

        private static bool VerifyTrialCounts(string email)
        {
            VerifyLastTrialDict.TryGetValue(email, out DateTime lastTrialTime);
            VerifyTrialCountDict.TryGetValue(email, out int trialCount);

            if ((DateTime.UtcNow - lastTrialTime) > TimeSpan.FromHours(24))
            {
                trialCount = 0;
            }

            trialCount++;

            VerifyTrialCountDict[email] = trialCount;
            VerifyLastTrialDict[email] = DateTime.UtcNow;

            if (trialCount > 5)
            {
                return false;
            }

            return true;
        }

        private static string GenerateRandom6DigitString()
        {
            return new Random().Next(100000, 999999).ToString();
        }
    }
}
