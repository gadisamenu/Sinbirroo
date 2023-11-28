using Application.Activities;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles:Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity,Activity>();    
            CreateMap<Activity,ActivityDto>()
            .ForMember(d=>d.HostUsername,o=> o.MapFrom(a=>a.Attendees.FirstOrDefault(usr=>usr.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee,AttendeeDto>()
            .ForMember(p=>p.Username,o=>o.MapFrom(aa=>aa.AppUser.UserName))  
            .ForMember(p=>p.DisplayName,o=>o.MapFrom(aa=>aa.AppUser.DisplayName))  
            .ForMember(p=>p.Bio,o=>o.MapFrom(aa=>aa.AppUser.Bio))
            .ForMember(p => p.Image, o => o.MapFrom(aa =>aa.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<AppUser,Profiles.Profile>()
             .ForMember(p => p.Image, o => o.MapFrom(au =>au.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}