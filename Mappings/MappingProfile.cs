using AutoMapper;
using Transfers.Models;
using Transfers.Resources;

namespace Transfers.Mappings
{
	public class MappingProfile : Profile
	{
		public MappingProfile()
		{
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
		}
	}
}