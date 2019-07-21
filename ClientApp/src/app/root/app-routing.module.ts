import { AuthGuard } from './../services/auth.guard';
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

const appRoutes: Routes = [
	{ path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
	{ path: 'login', component: LoginComponent },
	{ path: 'customers', component: CustomerListComponent, canActivate: [AuthGuard] }, { path: 'customers/new', component: CustomerFormComponent, canActivate: [AuthGuard] }, { path: 'customers/:id', component: CustomerFormComponent, canActivate: [AuthGuard] },
	{ path: 'destinations', component: DestinationListComponent, canActivate: [AuthGuard] }, { path: 'destinations/new', component: DestinationFormComponent, canActivate: [AuthGuard] }, { path: 'destinations/:id', component: DestinationFormComponent, canActivate: [AuthGuard] },
	{ path: 'drivers', component: DriverListComponent, canActivate: [AuthGuard] }, { path: 'drivers/new', component: DriverFormComponent, canActivate: [AuthGuard] }, { path: 'drivers/:id', component: DriverFormComponent, canActivate: [AuthGuard] },
	{ path: 'pickuppoints', component: PickupPointListComponent, canActivate: [AuthGuard] }, { path: 'pickuppoints/new', component: PickupPointFormComponent, canActivate: [AuthGuard] }, { path: 'pickuppoints/:id', component: PickupPointFormComponent, canActivate: [AuthGuard] },
	{ path: 'ports', component: PortListComponent, canActivate: [AuthGuard] }, { path: 'ports/new', component: PortFormComponent, canActivate: [AuthGuard] }, { path: 'ports/:id', component: PortFormComponent, canActivate: [AuthGuard] },
	{ path: 'routes', component: RouteListComponent, canActivate: [AuthGuard] }, { path: 'routes/new', component: RouteFormComponent, canActivate: [AuthGuard] }, { path: 'routes/:id', component: RouteFormComponent, canActivate: [AuthGuard] },
	{ path: 'taxOffices', component: TaxOfficeListComponent, canActivate: [AuthGuard] }, { path: 'taxOffices/new', component: TaxOfficeFormComponent, canActivate: [AuthGuard] }, { path: 'taxOffices/:id', component: TaxOfficeFormComponent, canActivate: [AuthGuard] },
	{ path: 'transfers', component: TransferListComponent, canActivate: [AuthGuard] }, { path: 'transfers/new', component: TransferFormComponent, canActivate: [AuthGuard] }, { path: 'transfers/:id', component: TransferFormComponent, canActivate: [AuthGuard] },
	{ path: 'vatStates', component: VatStateListComponent, canActivate: [AuthGuard] }, { path: 'vatStates/new', component: VatStateFormComponent, canActivate: [AuthGuard] }, { path: 'vatStates/:id', component: VatStateFormComponent, canActivate: [AuthGuard] },
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