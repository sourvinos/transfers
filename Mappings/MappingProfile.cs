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
				.ForMember(tr => tr.Customer, opt => opt.MapFrom(v => new CustomerResource { Description = v.Customer.Description }))
				.ForMember(tr => tr.Destination, opt => opt.MapFrom(v => new DestinationResource { Description = v.Destination.Description }))
				.ForMember(tr => tr.PickupPoint, opt => opt.MapFrom(v => new PickupPointResource
				{
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