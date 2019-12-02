import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

// Routes
import { HomeComponent } from '../home/home.component'
import { LoginComponent } from '../login/login.component'
import { CustomerListComponent } from '../customers/user-interface/list-customer.component'; import { CustomerFormComponent } from '../customers/user-interface/form-customer.component'
import { DestinationListComponent } from '../destinations/destination-list.component'; import { DestinationFormComponent } from '../destinations/destination-form.component'
import { DriverListComponent } from '../drivers/driver-list.component'; import { DriverFormComponent } from '../drivers/driver-form.component'
import { PickupPointListComponent } from '../pickupPoints/pickupPoint-list.component'; import { PickupPointsForRouteListComponent } from '../pickupPoints/pickupPointsForRoute-list.component'; import { PickupPointFormComponent } from '../pickupPoints/pickupPoint-form.component'
import { PortListComponent } from '../ports/port-list.component'; import { PortFormComponent } from '../ports/port-form.component'
import { RouteListComponent } from '../routes/route-list.component'; import { RouteFormComponent } from '../routes/route-form.component'
import { TaxOfficeListComponent } from '../taxOffices/taxOffice-list.component'; import { TaxOfficeFormComponent } from '../taxOffices/taxOffice-form.component'
import { TransferWrapperComponent } from '../transfers/user-interface/wrapper-transfer'; import { TransferListComponent } from '../transfers/user-interface/list-transfer'; import { TransferFormComponent } from '../transfers/user-interface/form-transfer'
import { VatStateListComponent } from '../vatStates/vatState-list.component'; import { VatStateFormComponent } from '../vatStates/vatState-form.component'
import { PageNotFoundComponent } from '../shared/components/page-not-found/page-not-found.component'

// Guards
import { CanDeactivateGuard } from '../services/can-deactivate-guard.service'

// Resolvers
import { CustomerListResolverService } from '../customers/classes/resolver-list-customer';
import { DestinationListResolverService } from '../destinations/destination-list-resolver.service';
import { DriverListResolverService } from './../drivers/driver-list-resolver.service';
import { PickupPointListResolverService } from '../pickupPoints/pickupPoint-list-resolver.service';
import { PortListResolverService } from '../ports/port-list-resolver.service';
import { RouteListResolverService } from '../routes/route-list-resolver.service';
import { TaxOfficeListResolverService } from '../taxOffices/port-list-resolver.service';
import { VatStateListResolverService } from '../vatStates/vatState-list-resolver.service';
import { TransferEditResolverService } from '../transfers/classes/resolver-edit-transfer';
import { TransferListResolverService } from '../transfers/classes/resolver-list-transfer';

const appRoutes: Routes = [
	{ path: '', component: HomeComponent, pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'customers', component: CustomerListComponent, resolve: { customerList: CustomerListResolverService } }, { path: 'customers/new', component: CustomerFormComponent, canDeactivate: [CanDeactivateGuard] }, { path: 'customers/:id', component: CustomerFormComponent, canDeactivate: [CanDeactivateGuard] },
	{ path: 'destinations', component: DestinationListComponent, resolve: { destinationList: DestinationListResolverService } }, { path: 'destinations/new', component: DestinationFormComponent, canDeactivate: [CanDeactivateGuard] }, { path: 'destinations/:id', component: DestinationFormComponent, canDeactivate: [CanDeactivateGuard] },
	{ path: 'drivers', component: DriverListComponent, resolve: { driverList: DriverListResolverService } }, { path: 'drivers/new', component: DriverFormComponent, canDeactivate: [CanDeactivateGuard] }, { path: 'drivers/:id', component: DriverFormComponent, canDeactivate: [CanDeactivateGuard] },
	{ path: 'pickupPoints', component: PickupPointListComponent, children: [{ path: 'routeId/:id', component: PickupPointsForRouteListComponent, resolve: { pickupPointList: PickupPointListResolverService } }, { path: 'new', component: PickupPointFormComponent, canDeactivate: [CanDeactivateGuard] }, { path: ':id', component: PickupPointFormComponent, canDeactivate: [CanDeactivateGuard] },] },
	{ path: 'ports', component: PortListComponent, resolve: { portList: PortListResolverService } }, { path: 'ports/new', component: PortFormComponent, canDeactivate: [CanDeactivateGuard] }, { path: 'ports/:id', component: PortFormComponent, canDeactivate: [CanDeactivateGuard] },
	{ path: 'routes', component: RouteListComponent, resolve: { routeList: RouteListResolverService } }, { path: 'routes/new', component: RouteFormComponent, canDeactivate: [CanDeactivateGuard] }, { path: 'routes/:id', component: RouteFormComponent, canDeactivate: [CanDeactivateGuard] },
	{ path: 'taxOffices', component: TaxOfficeListComponent, resolve: { taxOfficeList: TaxOfficeListResolverService } }, { path: 'taxOffices/new', component: TaxOfficeFormComponent, canDeactivate: [CanDeactivateGuard] }, { path: 'taxOffices/:id', component: TaxOfficeFormComponent, canDeactivate: [CanDeactivateGuard] },
	{
		path: 'transfers', component: TransferWrapperComponent, children: [{
			path: 'dateIn/:dateIn', component: TransferListComponent, resolve: { transferList: TransferListResolverService }, children: [
				{ path: 'transfer/new', component: TransferFormComponent, canDeactivate: [CanDeactivateGuard] },
				{ path: 'transfer/:transferId', component: TransferFormComponent, canDeactivate: [CanDeactivateGuard], resolve: { transferForm: TransferEditResolverService } }
			]
		}], runGuardsAndResolvers: 'always'
	},
	{ path: 'vatStates', component: VatStateListComponent, resolve: { vatStateList: VatStateListResolverService } }, { path: 'vatStates/new', component: VatStateFormComponent, canDeactivate: [CanDeactivateGuard] }, { path: 'vatStates/:id', component: VatStateFormComponent, canDeactivate: [CanDeactivateGuard] },
	{ path: 'pageNotFound', component: PageNotFoundComponent }
]

@NgModule({
	declarations: [],
	entryComponents: [],
	imports: [
		RouterModule.forRoot(appRoutes)
	],
	exports: [
		RouterModule
	]
})

export class AppRoutingModule { }