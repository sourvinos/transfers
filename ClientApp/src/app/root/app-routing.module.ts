import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../login/login.component';
import { CustomerFormComponent } from '../customers/customer-form.component'; import { CustomerListComponent } from '../customers/customer-list.component';
import { DestinationFormComponent } from '../destinations/destination-form.component'; import { DestinationListComponent } from '../destinations/destination-list.component';
import { DriverFormComponent } from '../drivers/driver-form.component'; import { DriverListComponent } from '../drivers/driver-list.component';
import { PickupPointFormComponent } from '../pickupPoints/pickupPoint-form.component'; import { PickupPointListComponent } from '../pickupPoints/pickupPoint-list.component';
import { PortFormComponent } from '../ports/port-form.component'; import { PortListComponent } from '../ports/port-list.component';
import { RouteFormComponent } from '../routes/route-form.component'; import { RouteListComponent } from '../routes/route-list.component';
import { TaxOfficeFormComponent } from '../taxOffices/taxOffice-form.component'; import { TaxOfficeListComponent } from '../taxOffices/taxOffice-list.component';
import { TransferFormComponent } from '../transfers/transfer-form.component'; import { TransferListComponent } from '../transfers/transfer-list.component'
import { VatStateFormComponent } from '../vatStates/vatState-form.component'; import { VatStateListComponent } from '../vatStates/vatState-list.component';

import { AuthGuardService } from '../services/auth-guard.service';

const appRoutes: Routes = [
	{ path: '', component: HomeComponent, pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'customers', component: CustomerListComponent }, { path: 'customers/new', component: CustomerFormComponent, canDeactivate: [AuthGuardService] }, { path: 'customers/:id', component: CustomerFormComponent, canDeactivate: [AuthGuardService] },
	{ path: 'destinations', component: DestinationListComponent }, { path: 'destinations/new', component: DestinationFormComponent, canDeactivate: [AuthGuardService] }, { path: 'destinations/:id', component: DestinationFormComponent, canDeactivate: [AuthGuardService] },
	{ path: 'drivers', component: DriverListComponent }, { path: 'drivers/new', component: DriverFormComponent, canDeactivate: [AuthGuardService] }, { path: 'drivers/:id', component: DriverFormComponent, canDeactivate: [AuthGuardService] },
	{ path: 'pickupPoints', component: PickupPointListComponent }, { path: 'pickupPoints/new', component: PickupPointFormComponent, canDeactivate: [AuthGuardService] }, { path: 'pickupPoints/:id', component: PickupPointFormComponent, canDeactivate: [AuthGuardService] },
	{ path: 'ports', component: PortListComponent }, { path: 'ports/new', component: PortFormComponent, canDeactivate: [AuthGuardService] }, { path: 'ports/:id', component: PortFormComponent, canDeactivate: [AuthGuardService] },
	{ path: 'routes', component: RouteListComponent }, { path: 'routes/new', component: RouteFormComponent, canDeactivate: [AuthGuardService] }, { path: 'routes/:id', component: RouteFormComponent, canDeactivate: [AuthGuardService] },
	{ path: 'taxOffices', component: TaxOfficeListComponent }, { path: 'taxOffices/new', component: TaxOfficeFormComponent, canDeactivate: [AuthGuardService] }, { path: 'taxOffices/:id', component: TaxOfficeFormComponent, canDeactivate: [AuthGuardService] },
	{ path: 'transfers', component: TransferListComponent }, { path: 'transfers/new', component: TransferFormComponent }, { path: 'transfers/:id', component: TransferFormComponent },
	{ path: 'vatStates', component: VatStateListComponent }, { path: 'vatStates/new', component: VatStateFormComponent, canDeactivate: [AuthGuardService] }, { path: 'vatStates/:id', component: VatStateFormComponent, canDeactivate: [AuthGuardService] },

];

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