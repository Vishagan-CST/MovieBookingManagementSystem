using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieBookingManagement.Application.Common.Interfaces;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.API.Controllers;

public class ChangePasswordRequest
{
    public string OldPassword { get; set; } = null!;
    public string NewPassword { get; set; } = null!;
}

public class UpdateProfileRequest
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string? AvatarUrl { get; set; }
}

public class UsersController : ApiControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> Get(CancellationToken cancellationToken)
    {
        var users = await _userService.GetAllUsersAsync(cancellationToken);
        return Ok(users);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<User>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var user = await _userService.GetUserByIdAsync(id, cancellationToken);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<User>> Create(User user, CancellationToken cancellationToken)
    {
        var createdUser = await _userService.CreateUserAsync(user, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = createdUser.Id }, createdUser);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(Guid id, User user, CancellationToken cancellationToken)
    {
        if (id != user.Id) return BadRequest("ID mismatch.");

        var result = await _userService.UpdateUserAsync(user, cancellationToken);
        if (!result) return BadRequest("Unable to update user.");

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await _userService.DeleteUserAsync(id, cancellationToken);
        if (!result) return NotFound();

        return NoContent();
    }

    [Authorize]
    [HttpPost("change-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest request, CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized("Invalid user identification in token.");
        }

        var result = await _userService.ChangePasswordAsync(userId, request.OldPassword, request.NewPassword, cancellationToken);
        if (!result) return BadRequest(new { message = "Incorrect current password or failed to change password." });

        return Ok(new { message = "Password changed successfully." });
    }

    [Authorize]
    [HttpPut("profile")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<User>> UpdateProfile(UpdateProfileRequest request, CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var user = await _userService.GetUserByIdAsync(userId, cancellationToken);
        if (user == null) return NotFound("User not found.");

        user.Name = request.Name;
        user.Email = request.Email;
        user.Phone = request.Phone;
        if (request.AvatarUrl != null)
        {
            user.AvatarUrl = request.AvatarUrl;
        }

        var result = await _userService.UpdateUserAsync(user, cancellationToken);
        if (!result) return BadRequest("Could not update profile.");

        return Ok(user);
    }

    [HttpPost("upload-avatar")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UploadAvatar(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(file.FileName);
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        var request = HttpContext.Request;
        var baseUrl = $"{request.Scheme}://{request.Host}";
        var fileUrl = $"{baseUrl}/uploads/{uniqueFileName}";

        return Ok(new { url = fileUrl });
    }
}
