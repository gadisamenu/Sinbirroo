using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
namespace Application.Comments{

    public class Create{
        public class Command: IRequest<Result<Comment>>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
    
        }

        public class CommandValidator: AbstractValidator<Command>{
            public CommandValidator()
            {
                // RuleFor(x=> x.comment).SetValidator(new CommentValidator());
                RuleFor(x => x.Body).NotEmpty().NotNull();
                RuleFor(x => x.ActivityId).NotEmpty().NotNull();
            }
        }

        public class Handler: IRequestHandler<Command,Result<Comment>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context,IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }
         
            public async Task<Result<Comment>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = _context.Users.FirstOrDefault(u=> u.UserName == _userAccessor.GetUsername());
                var activity = _context.Activities.FirstOrDefault( a => a.Id == request.ActivityId);
                if (activity == null) return null;

                var comment = new Comment{
                    Body = request.Body,
                    Author = user,
                    Activity = activity,
                };

                activity.Commments.Add(comment);

                var result = await _context.SaveChangesAsync() >0;
                if (!result) return Result<Comment>.Failure("Failed to create Comment");
                Console.WriteLine("succces",comment);
                return Result<Comment>.Success(comment);
            }
        }
    }
}

