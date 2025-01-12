using System.Text;
using Databases;
using Databases.TeamData;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Packets.Portfolio;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PortfolioController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public PortfolioController(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Get(int id)
        {
            var portfolio = await _context.Portfolios
                .Include(p => p.Items)
                .Include(p => p.Categories)
                .FirstOrDefaultAsync(p => p.Id == id);
            
            if (portfolio == null)
            {
                return BadRequest(new { message = "Can't find portfolio with this id." } );
            }
            else
            {
                var packet = new PortfolioPacket
                {
                    Type = portfolio.Type,
                    Name = portfolio.Name,
                    Url = portfolio.Url,
                    Categories = portfolio.Categories?.Select(c => c.Name).ToList(),
                    Items = portfolio.Items?.Select(i => new PortfolioItemData
                    {
                        Type = i.Type,
                        Value = System.IO.File.ReadAllText($"Datas\\Portfolio\\{i.Value}")
                    }).ToList()
                };

                return Ok(packet);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetIds(int page, string? query)
        {
            var portfolios = await _context.Portfolios
                .Include(p => p.Items)
                .Include(p => p.Categories)
                .ToListAsync();

            var portfolioIds = portfolios.Where(p => ValidatePortfolio(p, query))
                .Select(p => p.Id)
                .ToList();

            var firstIndex = (page - 1) * 16;
            var lastIndex = Math.Min(page * 16, portfolioIds.Count);
            portfolioIds = firstIndex >= lastIndex ? 
                new List<int>() : portfolioIds[firstIndex..lastIndex];

            return Ok(new { portfolioIds });
        }

        private bool ValidatePortfolio(Portfolio p, string? query)
        {
            var stringBuilder = new StringBuilder();

            stringBuilder.Append(p.Name).Append(p.Url);

            if (p.Categories != null) foreach (var category in p.Categories)
                stringBuilder.Append(category.Name);

            return string.IsNullOrEmpty(query) || stringBuilder.ToString().IndexOf(query, StringComparison.OrdinalIgnoreCase) != -1;
        }
    }
}