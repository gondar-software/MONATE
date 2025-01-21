using System.Text;
using Sodium;
    
namespace Helpers
{
    public class CryptionHelper
    {
        public readonly byte[] key;

        public CryptionHelper()
        {
            var password = Environment.GetEnvironmentVariable("PASSWORD");
            if (string.IsNullOrEmpty(password))
                this.key = SodiumCore.GetRandomBytes(32);
            else
                this.key = Convert.FromHexString(password);
        }

        public CryptionHelper(string passwordHex)
        {
            this.key = Convert.FromHexString(passwordHex);
        }

        public string Encrypt(string plaintext)
        {
            try
            {
                byte[] nonce = SodiumCore.GetRandomBytes(12);
                byte[] associatedData = SodiumCore.GetRandomBytes(16);

                byte[] cipherText = SecretAeadChaCha20Poly1305IETF.Encrypt(
                    Encoding.UTF8.GetBytes(plaintext),
                    nonce,
                    key,
                    associatedData
                );

                string nonceHex = Convert.ToHexString(nonce).ToLower();
                string associatedDataHex = Convert.ToHexString(associatedData).ToLower();
                string cipherTextHex = Convert.ToHexString(cipherText).ToLower();

                return nonceHex + associatedDataHex + cipherTextHex;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return "";
            }
        }

        public string Decrypt(string cipherTextHex)
        {
            try
            {
                byte[] nonce = Convert.FromHexString(cipherTextHex[0..24]);
                byte[] associatedData = Convert.FromHexString(cipherTextHex[24..56]);
                byte[] encryptedData = Convert.FromHexString(cipherTextHex[56..]);

                byte[] decrypted = SecretAeadChaCha20Poly1305IETF.Decrypt(
                    encryptedData,
                    nonce,
                    key,
                    associatedData
                );

                return Encoding.UTF8.GetString(decrypted);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return "";
            }
        }
    }
}