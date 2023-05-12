using System.Reflection.Metadata;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {

        public class Command: IRequest<Result<Unit>>
        {
            public Guid Id { get; set;}
        }

        public class Handler: IRequestHandler<Command,Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context,IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.
                    Include( a=> a.Attendees)
                    .ThenInclude(a=>a.AppUser)
                    .FirstOrDefaultAsync(x=>x.Id == request.Id);
                if (activity == null) return null;
                var user = _context.Users.FirstOrDefault(x=> x.UserName == _userAccessor.GetUsername());
                if (user == null) return null;
                
                if (user == null) return null;
                var attendee = activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);
                var hostUsername = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;

                if (attendee != null && hostUsername == user.UserName)
                    activity.IsCanceled = !activity.IsCanceled;
                else if(attendee != null)
                    activity.Attendees.Remove(attendee);
                else{
                    attendee = new ActivityAttendee{
                        AppUser = user,
                        Activity = activity,
                        IsHost = false
                    };
                    activity.Attendees.Add(attendee);
                }
           
                var result =await _context.SaveChangesAsync()> 0;

                return result? Result<Unit>.Success(Unit.Value): Result<Unit>.Failure("Problem updationg attendance");
            }
        }
    }
}