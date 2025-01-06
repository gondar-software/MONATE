namespace Helpers
{
    using Enums;
    using Exceptions;
    using Nethereum.Web3;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Queues;

    public static class BlockChainHelper
    {
        public static async Task<decimal> GetBalance(string address)
        {
            try
            {
                var web3 = new Web3($"https://mainnet.infura.io/v3/{Environment.GetEnvironmentVariable("META_MASK_API")}");
                var balanceWei = await web3.Eth.GetBalance.SendRequestAsync(address);
                var balanceEth = Web3.Convert.FromWei(balanceWei);

                using (var client = new HttpClient())
                {
                    var response = await client.GetAsync($"https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key={Environment.GetEnvironmentVariable("CRYPTO_COMPARE_API")}");
                    response.EnsureSuccessStatusCode();

                    var responseBody = await response.Content.ReadAsStringAsync();
                    var rate = (decimal?)JsonConvert.DeserializeObject<JObject>(responseBody)?["USD"];

                    if (rate == null)
                        throw new NetworkErrorException("Network error occurred.");
                    else
                    {
                        var usd = balanceEth * (decimal)rate;
                        return usd;
                    }
                }
            }
            catch (Exception ex)
            {
                Alerts.EnQueueAlert(AlertType.Error, ex.Message);
                return 0;
            }
        }
    }
}