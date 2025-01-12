using System.Text;
using Databases;
using Databases.EndpointData;
using Databases.TeamData;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Packets.Portfolio;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PortfolioController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly ILogger<PortfolioController> _logger;

        public PortfolioController(DatabaseContext context, ILogger<PortfolioController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetIds([FromQuery] int page = 1, [FromQuery] string? query = null)
        {
            try
            {
                var portfolioIds = await _context.Portfolios
                    .AsNoTracking()
                    .Include(p => p.Items)
                    .Include(p => p.Categories)
                    .Where(p => string.IsNullOrEmpty(query) || ValidatePortfolio(p, query))
                    .Select(p => p.Id)
                    .ToListAsync();

                var firstIndex = (page - 1) * 16;
                var lastIndex = Math.Min(page * 16, portfolioIds.Count);
                portfolioIds = firstIndex >= lastIndex ? 
                    new List<int>() : portfolioIds[firstIndex..lastIndex];

                return Ok(new { PortfolioIds = portfolioIds });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving portfolio IDs");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreatePortfolio([FromBody] PortfolioPacket packet)
        {
            try
            {
                var portfolio = new Portfolio
                {
                    Type = packet.Type,
                    Name = packet.Name,
                    Url = packet.Url,
                    Categories = packet.Categories?.Select(c => new Category { Name = c }).ToList(),
                    Items = packet.Items?.Select(i => new PortfolioItem
                    {
                        Type = i.Type,
                        Path = FileHelper.SaveFileAndGetPath(i.File)
                    }).ToList()
                };

                _context.Portfolios.Add(portfolio);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetPortfolio), new { id = portfolio.Id }, portfolio);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating portfolio");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPortfolio(int id)
        {
            var portfolio = await _context.Portfolios
                .AsNoTracking()
                .Include(p => p.Items)
                .Include(p => p.Categories)
                .FirstOrDefaultAsync(p => p.Id == id);
            
            if (portfolio == null)
            {
                return NotFound();
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
                        File = FileHelper.CreateFormFile(i.Path)
                    }).ToList()
                };

                return Ok(packet);
            }
        }

        private bool ValidatePortfolio(Portfolio p, string query)
        {
            var searchText = new StringBuilder()
                .Append(p.Name)
                .Append(p.Url)
                .AppendJoin(" ", p.Categories?.Select(c => c.Name) ?? Array.Empty<string>())
                .ToString();

            return searchText.Contains(query, StringComparison.OrdinalIgnoreCase);
        }
    }
}