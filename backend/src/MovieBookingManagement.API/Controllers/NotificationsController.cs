using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieBookingManagement.Application.Common.Interfaces;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.API.Controllers;

public class NotificationsController : ApiControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Notification>>> Get(CancellationToken cancellationToken)
    {
        var notifications = await _notificationService.GetAllNotificationsAsync(cancellationToken);
        return Ok(notifications);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Notification>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var notification = await _notificationService.GetNotificationByIdAsync(id, cancellationToken);
        if (notification == null) return NotFound();
        return Ok(notification);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<Notification>> Create(Notification notification, CancellationToken cancellationToken)
    {
        var createdNotification = await _notificationService.CreateNotificationAsync(notification, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = createdNotification.Id }, createdNotification);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(Guid id, Notification notification, CancellationToken cancellationToken)
    {
        if (id != notification.Id) return BadRequest("ID mismatch.");

        var result = await _notificationService.UpdateNotificationAsync(notification, cancellationToken);
        if (!result) return BadRequest("Unable to update notification.");

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await _notificationService.DeleteNotificationAsync(id, cancellationToken);
        if (!result) return NotFound();

        return NoContent();
    }
}
