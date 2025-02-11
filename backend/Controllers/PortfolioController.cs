using System.Text;
using Databases;
using Databases.TeamData;
using Enums;
using Microsoft.AspNetCore.Authorization;
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

        [Authorize]
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

                var maxPage = (int)Math.Ceiling((double)portfolioIds.Count / 16);
                var firstIndex = (Math.Min(page, maxPage) - 1) * 16;
                var lastIndex = Math.Min(Math.Min(page, maxPage) * 16, portfolioIds.Count);
                portfolioIds = firstIndex >= lastIndex ? 
                    new List<int>() : portfolioIds[firstIndex..lastIndex];

                return Ok(new { PortfolioIds = portfolioIds, MaxPage = maxPage });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving portfolio IDs");
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
            }
        }

        [Authorize(Roles = "Admin, Team")]
        [HttpPost("create")]
        public async Task<IActionResult> CreatePortfolio([FromBody] PortfolioPacket packet)
        {
            try
            {
                var categoryIds = packet.Categories?.Select(ca => ca.Id).ToList();

                var portfolio = new Portfolio
                {
                    Type = packet.Type,
                    Name = packet.Name,
                    Url = packet.Url,
                    Categories = categoryIds != null && categoryIds.Any()
                        ? await _context.Categories
                            .Where(c => categoryIds.Contains(c.Id))
                            .ToListAsync()
                        : null,
                    Items = packet.Items?.Select(i => new PortfolioItem
                    {
                        Type = i.Type,
                        Path = i.Path,
                    }).ToList(),
                };

                _context.Portfolios.Add(portfolio);
                await _context.SaveChangesAsync();

                return Ok(new { id = portfolio.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating portfolio");
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
            }
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPortfolio(int id)
        {
            try
            {
                var portfolio = await _context.Portfolios
                    .AsNoTracking()
                    .Include(p => p.Items)
                    .Include(p => p.Categories)
                    .FirstOrDefaultAsync(p => p.Id == id);
                
                if (portfolio == null)
                {
                    return StatusCode((int)ErrorType.PortfolioNotFound, ErrorType.PortfolioNotFound.ToString());
                }
                else
                {
                    var packet = new
                    {
                        Type = portfolio.Type,
                        Name = portfolio.Name,
                        Url = portfolio.Url,
                        Categories = portfolio.Categories?.Select(c => new
                            {
                                Id = c.Id,
                                Name = c.Name,
                                Description = c.Description,
                            }).ToList() ?? [],
                        Items = portfolio.Items?.Select(i => new
                            {
                                Type = i.Type,
                                Path = i.Path,
                            }).ToList() ?? [],
                    };

                    return Ok(packet);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving portfolio");
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
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