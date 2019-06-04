using AutoMapper;
using Transfers.Models;
using Transfers.Resources;

namespace Transfers.Mappings
{
	public class MappingProfile : Profile
	{
		public MappingProfile()
		{
			// From domain to api
			CreateMap<Transfer, TransferResource>()
				.ForMember(tr => tr.Customer, opt => opt.MapFrom(v => new CustomerResource { Id = v.Customer.Id, Description = v.Customer.Description }))
				.ForMember(tr => tr.Destination, opt => opt.MapFrom(v => new DestinationResource { Id = v.Destination.Id, Description = v.Destination.Description }))
				.ForMember(tr => tr.TransferType, opt => opt.MapFrom(v => new TransferTypeResource { Id = v.TransferType.Id, Description = v.TransferType.Description }))
				.ForMember(tr => tr.PickupPoint, opt => opt.MapFrom(v => new PickupPointResource
				{
					Id = v.PickupPoint.Id,
					Description = v.PickupPoint.Description,
					ExactPoint = v.PickupPoint.ExactPoint,
					Time = v.PickupPoint.Time,
					Route = new RouteResource
					{
						Description = v.PickupPoint.Route.Description
					}
				}));
			// From api to domain 
			// v refers to the domain class (.cs) 
			// vr refers to the api class (.ts)
			CreateMap<SaveTransferResource, Transfer>()
				.ForMember(v => v.Id, opt => opt.Ignore())
				.ForMember(v => v.DateIn, opt => opt.MapFrom(vr => vr.dateIn))
				.ForMember(v => v.CustomerId, opt => opt.MapFrom(vr => vr.CustomerId))
				.ForMember(v => v.TransferTypeId, opt => opt.MapFrom(vr => vr.TransferTypeId))
				.ForMember(v => v.PickupPointId, opt => opt.MapFrom(vr => vr.PickupPointId))
				.ForMember(v => v.Adults, opt => opt.MapFrom(vr => vr.Adults))
				.ForMember(v => v.kids, opt => opt.MapFrom(vr => vr.Kids))
				.ForMember(v => v.Free, opt => opt.MapFrom(vr => vr.Free))
				.ForMember(v => v.DestinationId, opt => opt.MapFrom(vr => vr.DestinationId))
				.ForMember(v => v.Remarks, opt => opt.MapFrom(vr => vr.Remarks))
				.ForMember(v => v.User, opt => opt.MapFrom(vr => vr.User));
		}
	}
}