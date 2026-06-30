using Microsoft.AspNetCore.Mvc;
using MovieBookingManagement.Application.Common.Interfaces;
using MovieBookingManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace MovieBookingManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InquiriesController : ControllerBase
    {
        private readonly IApplicationDbContext _context;

        public InquiriesController(IApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetInquiries()
        {
            var inquiries = await _context.Inquiries.ToListAsync();
            return Ok(inquiries);
        }

        [HttpPost]
        public async Task<IActionResult> CreateInquiry([FromBody] Inquiry inquiry)
        {
            _context.Inquiries.Add(inquiry);
            await _context.SaveChangesAsync();
            return Ok(inquiry);
        }

        [HttpPut("{id}/resolve")]
        public async Task<IActionResult> ResolveInquiry(string id)
        {
            var inquiry = await _context.Inquiries.FindAsync(id);
            if (inquiry == null) return NotFound();

            inquiry.Status = "Resolved";
            await _context.SaveChangesAsync();
            return Ok(inquiry);
        }

        [HttpPost("{id}/reply")]
        public async Task<IActionResult> ReplyToInquiry(string id, [FromBody] ReplyDto replyDto)
        {
            var inquiry = await _context.Inquiries.FindAsync(id);
            if (inquiry == null) return NotFound();

          
            System.Console.WriteLine($"[EMAIL SENT] To: {inquiry.Email} | Subject: RE: {inquiry.Subject}");
            System.Console.WriteLine($"Message: {replyDto.Message}");

            inquiry.Status = "Resolved";
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Reply sent successfully and inquiry marked as resolved." });
        }
    }

    public class ReplyDto
    {
        public string Message { get; set; } = string.Empty;
    }
}
