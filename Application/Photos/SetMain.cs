using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command:IRequest<Result<Unit>>{
            public string Id { get; set; }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        private readonly IPhotoAccessor _photoAccessor;

            public Handler(DataContext context,IUserAccessor userAccessor,IPhotoAccessor photoAccessor)
            {
                _photoAccessor = photoAccessor;
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(u => u.Photos)
                            .FirstOrDefaultAsync( ur => ur.UserName == _userAccessor.GetUsername());

                if (user == null) return null;

                var photo = user.Photos.FirstOrDefault(photo => photo.Id == request.Id);
                if (photo == null) return null;

                var currentMain = user.Photos.FirstOrDefault(photo => photo.IsMain);
                
                if (currentMain != null) currentMain.IsMain = false;

                photo.IsMain = true;

                var success = await _context.SaveChangesAsync(cancellationToken) > 0;

                if (success)  return Result<Unit>.Success(Unit.Value);
            
                return Result<Unit>.Failure("Problem setting main photo");
            }
        }
    }
}