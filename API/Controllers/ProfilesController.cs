using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class ProfilesController : BaseApiController
    {
        [HttpGet("{userName}")]
        public async Task<IActionResult> Detail(string userName)
        {
            return HandleResult(await Mediator.Send(new Details.Query{UserName=userName}));
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdateProfileDto profileDto)
        {
            return HandleResult(await Mediator.Send(new Update.Command{DisplayName=profileDto.DisplayName,Bio=profileDto.Bio}));
        }
    }
}