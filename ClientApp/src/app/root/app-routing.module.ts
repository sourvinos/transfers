import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
// Routes
import { HomeComponent } from '../home/home.component'
import { LoginComponent } from '../login/user-interface/form-login'
import { CustomerListComponent } from '../customers/user-interface/list-customer'; import { CustomerFormComponent } from '../customers/user-interface/form-customer'
import { DestinationListComponent } from '../destinations/destination-list.component'; import { DestinationFormComponent } from '../destinations/destination-form.component'
import { DriverListComponent } from '../drivers/driver-list.component'; import { DriverFormComponent } from '../drivers/driver-form.component'
import { PageNotFoundComponent } from '../shared/components/page-not-found/page-not-found.component'
import { PortListComponent } from '../ports/port-list.component'; import { PortFormComponent } from '../ports/port-form.component'
import { RouteListComponent } from '../routes/route-list.component'; import { RouteFormComponent } from '../routes/route-form.component'
import { TaxOfficeListComponent } from '../taxOffices/taxOffice-list.component'; import { TaxOfficeFormComponent } from '../taxOffices/taxOffice-form.component'
import { VatStateListComponent } from '../vatStates/vatState-list.component'; import { VatStateFormComponent } from '../vatStates/vatState-form.component'
import { WrapperPickupPointComponent } from '../pickupPoints/user-interface/wrapper-pickupPoint'; import { ListPickupPointComponent } from '../pickupPoints/user-interface/list-pickupPoint'; import { FormPickupPointComponent } from '../pickupPoints/user-interface/form-pickupPoint'
import { WrapperTransferComponent } from '../transfers/user-interface/wrapper-transfer'; import { ListTransferComponent } from '../transfers/user-interface/list-transfer'; import { FormTransferComponent } from '../transfers/user-interface/form-transfer'

// Guards
import { AuthGuardService } from '../services/auth-guard.service';
import { CanDeactivateGuard } from '../services/can-deactivate-guard.service'

// Resolvers
import { CustomerListResolverService } from '../customers/classes/resolver-list-customer';
import { DestinationListResolverService } from '../destinations/destination-list-resolver.service';
import { DriverListResolverService } from './../drivers/driver-list-resolver.service';
import { PickupPointListResolverService } from '../pickupPoints/classes/resolver-list-pickupPoint';
import { PortListResolverService } from '../ports/port-list-resolver.service';
import { RouteListResolverService } from '../routes/route-list-resolver.service';
import { TaxOfficeListResolverService } from '../taxOffices/port-list-resolver.service';
import { TransferEditResolverService } from '../transfers/classes/resolver-edit-transfer';
import { TransferListResolverService } from '../transfers/classes/resolver-list-transfer';
import { VatStateListResolverService } from '../vatStates/vatState-list-resolver.service';

const appRoutes: Routes = [
	{ path: '', component: HomeComponent, canActivate: [AuthGuardService], pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'customers', component: CustomerListComponent, canActivate: [AuthGuardService], resolve: { customerList: CustomerListResolverService } }, { path: 'customers/new', component: CustomerFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }, { path: 'customers/:id', component: CustomerFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
	{ path: 'destinations', component: DestinationListComponent, canActivate: [AuthGuardService], resolve: { destinationList: DestinationListResolverService } }, { path: 'destinations/new', component: DestinationFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }, { path: 'destinations/:id', component: DestinationFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
	{ path: 'drivers', component: DriverListComponent, canActivate: [AuthGuardService], resolve: { driverList: DriverListResolverService } }, { path: 'drivers/new', component: DriverFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }, { path: 'drivers/:id', component: DriverFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
	{
		path: 'pickupPoints', component: WrapperPickupPointComponent, canActivate: [AuthGuardService], children: [
			{
				path: 'routeId/:routeId', component: ListPickupPointComponent, canActivate: [AuthGuardService], resolve: { pickupPointList: PickupPointListResolverService }, children: [
					{ path: 'pickupPoint/new', component: FormPickupPointComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
					{ path: 'pickupPoint/:pickupPointId', component: FormPickupPointComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }
				], runGuardsAndResolvers: 'always'
			}]
	},
	{ path: 'ports', component: PortListComponent, canActivate: [AuthGuardService], resolve: { portList: PortListResolverService } }, { path: 'ports/new', component: PortFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }, { path: 'ports/:id', component: PortFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
	{ path: 'routes', component: RouteListComponent, canActivate: [AuthGuardService], resolve: { routeList: RouteListResolverService } }, { path: 'routes/new', component: RouteFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }, { path: 'routes/:id', component: RouteFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
	{ path: 'taxOffices', component: TaxOfficeListComponent, resolve: { taxOfficeList: TaxOfficeListResolverService } }, { path: 'taxOffices/new', component: TaxOfficeFormComponent, canDeactivate: [CanDeactivateGuard] }, { path: 'taxOffices/:id', component: TaxOfficeFormComponent, canDeactivate: [CanDeactivateGuard] },
	{
		path: 'transfers', component: WrapperTransferComponent, canActivate: [AuthGuardService], children: [
			{
				path: 'dateIn/:dateIn', component: ListTransferComponent, canActivate: [AuthGuardService], resolve: { transferList: TransferListResolverService }, children: [
					{ path: 'transfer/new', component: FormTransferComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
					{ path: 'transfer/:transferId', component: FormTransferComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { transferForm: TransferEditResolverService } }
				], runGuardsAndResolvers: 'always'
			}]
	},
	{ path: 'vatStates', component: VatStateListComponent, canActivate: [AuthGuardService], resolve: { vatStateList: VatStateListResolverService } }, { path: 'vatStates/new', component: VatStateFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }, { path: 'vatStates/:id', component: VatStateFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
	{ path: 'pageNotFound', component: PageNotFoundComponent }
]

@NgModule({
	declarations: [],
	entryComponents: [],
	imports: [
		RouterModule.forRoot(appRoutes, { onSameUrlNavigation: 'reload' })
	],
	exports: [
		RouterModule
	]
})

export class AppRoutingModule { }