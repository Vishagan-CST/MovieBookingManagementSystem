using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieBookingManagement.Application.Common.Interfaces;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.API.Controllers;

public class SettingsController : ApiControllerBase
{
    private readonly ISystemSettingService _systemSettingService;

    public SettingsController(ISystemSettingService systemSettingService)
    {
        _systemSettingService = systemSettingService;
    }

    [HttpGet]
    public async Task<ActionResult<SystemSetting>> Get(CancellationToken cancellationToken)
    {
        var setting = await _systemSettingService.GetSystemSettingAsync(cancellationToken);
        return Ok(setting);
    }

    [HttpPut]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(SystemSetting setting, CancellationToken cancellationToken)
    {
        var success = await _systemSettingService.UpdateSystemSettingAsync(setting, cancellationToken);
        if (!success) return BadRequest();
        return NoContent();
    }
}
