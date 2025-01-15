using System.Text;
using System.Text.RegularExpressions;

namespace Helpers
{
    public static class DotEnvHelper
    {
        public static void Load(string filePath = ".env")
        {
            if (!File.Exists(filePath))
                throw new FileNotFoundException($"The .env file was not found at: {filePath}");

            foreach (var (key, value) in Parse(File.ReadAllLines(filePath)))
            {
                Environment.SetEnvironmentVariable(key, value);
            }
        }
        
        private static IEnumerable<(string Key, string Value)> Parse(string[] lines)
        {
            var multiLineBuffer = new StringBuilder();
            string multiLineKey = "";

            foreach (var rawLine in lines)
            {
                var line = rawLine.Trim();

                if (string.IsNullOrEmpty(line) || line.StartsWith("#"))
                    continue;

                if (line.EndsWith("\\") && !string.IsNullOrEmpty(multiLineKey))
                {
                    multiLineBuffer.AppendLine(line.TrimEnd('\\'));
                    continue;
                }
                else if (!string.IsNullOrEmpty(multiLineKey))
                {
                    multiLineBuffer.Append(line);
                    yield return (multiLineKey, multiLineBuffer.ToString().Trim());
                    multiLineKey = "";
                    multiLineBuffer.Clear();
                    continue;
                }

                var match = Regex.Match(line, @"^\s*([\w.-]+)\s*=\s*(.*)?\s*$");
                if (!match.Success)
                    throw new FormatException($"Invalid .env file format: {line}");

                var key = match.Groups[1].Value;
                var value = UnwrapValue(match.Groups[2].Value);

                if (value.EndsWith("\\"))
                {
                    multiLineKey = key;
                    multiLineBuffer.AppendLine(value.TrimEnd('\\'));
                }
                else
                {
                    yield return (key, value);
                }
            }
        }

        private static string UnwrapValue(string value)
        {
            value = value.Trim();

            if ((value.StartsWith("\"") && value.EndsWith("\"")) || (value.StartsWith("'") && value.EndsWith("'")))
            {
                value = value[1..^1];
            }

            return Regex.Unescape(value);
        }
    }
}
