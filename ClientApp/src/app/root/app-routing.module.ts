import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../login/login.component';
import { CustomerFormComponent } from '../customers/customer-form.component'; import { CustomerListComponent } from '../customers/customer-list.component';
import { DestinationFormComponent } from '../destinations/destination-form.component'; import { DestinationListComponent } from '../destinations/destination-list.component';
import { PickupPointFormComponent } from '../pickupPoints/pickupPoint-form.component'; import { PickupPointListComponent } from '../pickupPoints/pickupPoint-list.component';
import { RouteFormComponent } from '../routes/route-form.component'; import { RouteListComponent } from '../routes/route-list.component';
import { TaxOfficeFormComponent } from '../taxOffices/taxOffice-form.component'; import { TaxOfficeListComponent } from '../taxOffices/taxOffice-list.component';
import { TransferFormComponent } from '../transfers/transfer-form.component'; import { TransferListComponent } from '../transfers/transfer-list.component'
import { TransferTypeFormComponent } from '../transferTypes/transferType-form.component'; import { TransferTypeListComponent } from '../transferTypes/transferType-list.component';
import { VatStateFormComponent } from '../vatStates/vatState-form.component'; import { VatStateListComponent } from '../vatStates/vatState-list.component';

const appRoutes: Routes = [
	{ path: '', component: HomeComponent, pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'customers', component: CustomerListComponent }, { path: 'customers/new', component: CustomerFormComponent }, { path: 'customers/:id', component: CustomerFormComponent },
	{ path: 'routes', component: RouteListComponent }, { path: 'routes/new', component: RouteFormComponent }, { path: 'routes/:id', component: RouteFormComponent },
	{ path: 'pickuppoints', component: PickupPointListComponent }, { path: 'pickuppoints/new', component: PickupPointFormComponent }, { path: 'pickuppoints/:id', component: PickupPointFormComponent },
	{ path: 'destinations', component: DestinationListComponent }, { path: 'destinations/new', component: DestinationFormComponent }, { path: 'destinations/:id', component: DestinationFormComponent },
	{ path: 'taxOffices', component: TaxOfficeListComponent }, { path: 'taxOffices/new', component: TaxOfficeFormComponent }, { path: 'taxOffices/:id', component: TaxOfficeFormComponent },
	{ path: 'vatStates', component: VatStateListComponent }, { path: 'vatStates/new', component: VatStateFormComponent }, { path: 'vatStates/:id', component: VatStateFormComponent },
	{ path: 'transferTypes', component: TransferTypeListComponent }, { path: 'transferTypes/new', component: TransferTypeFormComponent }, { path: 'transferTypes/:id', component: TransferTypeFormComponent },
	{ path: 'transfers', component: TransferListComponent }, { path: 'transfers/new', component: TransferFormComponent }, { path: 'transfers/:id', component: TransferFormComponent },
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