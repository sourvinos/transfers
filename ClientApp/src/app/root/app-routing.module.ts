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
	{ path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuardService] },
	{ path: 'login', component: LoginComponent },
	{ path: 'customers', component: CustomerListComponent, canActivate: [AuthGuardService] }, { path: 'customers/new', component: CustomerFormComponent, canActivate: [AuthGuardService], canDeactivate: [AuthGuardService] }, { path: 'customers/:id', component: CustomerFormComponent, canActivate: [AuthGuardService] },
	{ path: 'destinations', component: DestinationListComponent, canActivate: [AuthGuardService] }, { path: 'destinations/new', component: DestinationFormComponent, canActivate: [AuthGuardService] }, { path: 'destinations/:id', component: DestinationFormComponent, canActivate: [AuthGuardService] },
	{ path: 'drivers', component: DriverListComponent, canActivate: [AuthGuardService] }, { path: 'drivers/new', component: DriverFormComponent, canActivate: [AuthGuardService] }, { path: 'drivers/:id', component: DriverFormComponent, canActivate: [AuthGuardService] },
	{ path: 'pickupPoints', component: PickupPointListComponent, canActivate: [AuthGuardService] }, { path: 'pickupPoints/new', component: PickupPointFormComponent, canActivate: [AuthGuardService] }, { path: 'pickupPoints/:id', component: PickupPointFormComponent, canActivate: [AuthGuardService] },
	{ path: 'ports', component: PortListComponent, canActivate: [AuthGuardService] }, { path: 'ports/new', component: PortFormComponent, canActivate: [AuthGuardService] }, { path: 'ports/:id', component: PortFormComponent, canActivate: [AuthGuardService] },
	{ path: 'routes', component: RouteListComponent, canActivate: [AuthGuardService] }, { path: 'routes/new', component: RouteFormComponent, canActivate: [AuthGuardService] }, { path: 'routes/:id', component: RouteFormComponent, canActivate: [AuthGuardService] },
	{ path: 'taxOffices', component: TaxOfficeListComponent, canActivate: [AuthGuardService] }, { path: 'taxOffices/new', component: TaxOfficeFormComponent, canActivate: [AuthGuardService] }, { path: 'taxOffices/:id', component: TaxOfficeFormComponent, canActivate: [AuthGuardService] },
	{ path: 'transfers', component: TransferListComponent, canActivate: [AuthGuardService] }, { path: 'transfers/new', component: TransferFormComponent, canActivate: [AuthGuardService] }, { path: 'transfers/:id', component: TransferFormComponent, canActivate: [AuthGuardService] },
	{ path: 'vatStates', component: VatStateListComponent, canActivate: [AuthGuardService] }, { path: 'vatStates/new', component: VatStateFormComponent, canActivate: [AuthGuardService] }, { path: 'vatStates/:id', component: VatStateFormComponent, canActivate: [AuthGuardService] },
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