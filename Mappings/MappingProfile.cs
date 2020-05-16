using AutoMapper;

namespace Transfers {

    public class MappingProfile : Profile {

        public MappingProfile() {
            // Read
            CreateMap<Transfer, TransferResource>()
                .ForMember(tr => tr.Destination, opt => opt.MapFrom(v => new DestinationResource { Id = v.Destination.Id, Abbreviation = v.Destination.Abbreviation, Description = v.Destination.Description }))
                .ForMember(tr => tr.Customer, opt => opt.MapFrom(v => new CustomerResource { Id = v.Customer.Id, Description = v.Customer.Description }))
                .ForMember(tr => tr.Driver, opt => opt.MapFrom(v => new DriverResource { Id = v.Driver.Id, Description = v.Driver.Description }))
                .ForMember(tr => tr.PickupPoint, opt => opt.MapFrom(v => new PickupPointResource {
                    Id = v.PickupPoint.Id,
                        Description = v.PickupPoint.Description,
                        ExactPoint = v.PickupPoint.ExactPoint,
                        Time = v.PickupPoint.Time,
                        Route = new RouteResource {
                            Id = v.PickupPoint.Route.Id,
                                Description = v.PickupPoint.Route.Description,
                                FullDescription = v.PickupPoint.Route.FullDescription,
                                Port = new PortResource {
                                    Id = v.PickupPoint.Route.PortId,
                                        Description = v.PickupPoint.Route.Port.Description
                                }
                        }
                }));
            // Write
            CreateMap<SaveTransferResource, Transfer>()
                .ForMember(v => v.Id, opt => opt.Ignore())
                .ForMember(v => v.DateIn, opt => opt.MapFrom(vr => vr.dateIn))
                .ForMember(v => v.CustomerId, opt => opt.MapFrom(vr => vr.CustomerId))
                .ForMember(v => v.PickupPointId, opt => opt.MapFrom(vr => vr.PickupPointId))
                .ForMember(v => v.Adults, opt => opt.MapFrom(vr => vr.Adults))
                .ForMember(v => v.Kids, opt => opt.MapFrom(vr => vr.Kids))
                .ForMember(v => v.Free, opt => opt.MapFrom(vr => vr.Free))
                .ForMember(v => v.DestinationId, opt => opt.MapFrom(vr => vr.DestinationId))
                .ForMember(v => v.DriverId, opt => opt.MapFrom(vr => vr.DriverId))
                .ForMember(v => v.Remarks, opt => opt.MapFrom(vr => vr.Remarks))
                .ForMember(v => v.UserId, opt => opt.MapFrom(vr => vr.UserId));
        }

    }

}