using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController:ControllerBase
    {
        private IMediator _mediatr;

        protected IMediator Mediator => _mediatr??= HttpContext.RequestServices.GetService<IMediator>();
        
    }
}