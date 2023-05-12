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

            CreateMap<ActivityAttendee,Profiles.Profile>()
            .ForAllMembers(o=>o.MapFrom(aa=>aa.AppUser));        
        }
    }
}