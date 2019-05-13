using AutoMapper;
using Transfers.Models;
using Transfers.Resources;

namespace Transfers.Mappings
{
	public class MappingProfile : Profile
	{
		public MappingProfile()
		{
			// From Domain To API
			CreateMap<Customer, CustomerResource>()
				.ForMember(cr => cr.TaxOffice, opt => opt.MapFrom(v => v.TaxOffice.Description));
		}
	}
}