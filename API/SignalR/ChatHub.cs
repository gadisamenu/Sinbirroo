using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR{
    public class ChatHub:Hub{
        private readonly IMediator _mediator;

        public ChatHub(IMediator mediator){
            _mediator = mediator;
        }

        public async Task SendComment(Create.Command command){
            var comment = await _mediator.Send(command);
            Console.WriteLine(command.ActivityId.ToString());

            await Clients.Group(command.ActivityId.ToString())
            .SendAsync("RecieveComment", comment.Value);
        }

        public override async Task OnConnectedAsync(){

            var context = Context.GetHttpContext();
            var activityId = context.Request.Query["activityId"];
            await Groups.AddToGroupAsync(Context.ConnectionId,activityId);

            var result = await _mediator.Send(new List.Query{ActivityId = Guid.Parse(activityId)});

            await Clients.Caller.SendAsync("LoadComments",result.Value);

        }
    }

}