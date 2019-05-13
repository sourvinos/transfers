import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RootComponent } from './root.component';
import { RouterModule } from '@angular/router';

import { LoginComponent } from '../login/login.component';
import { MainComponent } from '../shared/components/main/main.component';

import { DeleteDialogComponent } from '../shared/components/delete-dialog/delete-dialog.component';
import { HomeComponent } from '../home/home.component';
import { MessageDialogComponent } from '../shared/components/message-dialog/message-dialog.component';

import { AuthInterceptor } from '../services/auth.interceptor';

import { CustomerListComponent } from '../customers/customer-list.component';
import { CustomerFormComponent } from '../customers/customer-form.component';

import { RouteListComponent } from '../routes/route-list.component';
import { RouteFormComponent } from '../routes/route-form.component';

import { PickupPointListComponent } from '../pickupPoints/pickupPoint-list.component';
import { PickupPointFormComponent } from '../pickupPoints/pickupPoint-form.component';

import { DestinationListComponent } from '../destinations/destination-list.component';
import { DestinationFormComponent } from '../destinations/destination-form.component';

import { TaxOfficeListComponent } from '../taxOffices/taxOffice-list.component';
import { TaxOfficeFormComponent } from '../taxOffices/taxOffice-form.component';

import { VatStateListComponent } from '../vatStates/vatState-list.component';
import { VatStateFormComponent } from '../vatStates/vatState-form.component';

import { TransferTypeListComponent } from '../transferTypes/transferType-list.component';
import { TransferTypeFormComponent } from '../transferTypes/transferType-form.component';

import { TransferListComponent } from '../transfers/transfer-list.component'
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

@NgModule({
    declarations: [
        RootComponent,
        SidebarComponent,
        HomeComponent,
        MainComponent,
        LoginComponent,
        DeleteDialogComponent,
        MessageDialogComponent,
        CustomerListComponent, CustomerFormComponent,
        RouteListComponent, RouteFormComponent,
        PickupPointListComponent, PickupPointFormComponent,
        DestinationListComponent, DestinationFormComponent,
        TaxOfficeListComponent, TaxOfficeFormComponent,
        VatStateListComponent, VatStateFormComponent,
        TransferTypeListComponent, TransferTypeFormComponent,
        TransferListComponent
    ],
    entryComponents: [
        DeleteDialogComponent,
        MessageDialogComponent
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
            { path: '', component: HomeComponent, pathMatch: 'full' },

            { path: 'customers', component: CustomerListComponent },
            { path: 'customers/new', component: CustomerFormComponent },
            { path: 'customers/:id', component: CustomerFormComponent },

            { path: 'routes', component: RouteListComponent },
            { path: 'routes/new', component: RouteFormComponent },
            { path: 'routes/:id', component: RouteFormComponent },

            { path: 'pickuppoints', component: PickupPointListComponent },
            { path: 'pickuppoints/new', component: PickupPointFormComponent },
            { path: 'pickuppoints/:id', component: PickupPointFormComponent },

            { path: 'destinations', component: DestinationListComponent },
            { path: 'destinations/new', component: DestinationFormComponent },
            { path: 'destinations/:id', component: DestinationFormComponent },

            { path: 'taxOffices', component: TaxOfficeListComponent },
            { path: 'taxOffices/new', component: TaxOfficeFormComponent },
            { path: 'taxOffices/:id', component: TaxOfficeFormComponent },

            { path: 'vatStates', component: VatStateListComponent },
            { path: 'vatStates/new', component: VatStateFormComponent },
            { path: 'vatStates/:id', component: VatStateFormComponent },

            { path: 'transferTypes', component: TransferTypeListComponent },
            { path: 'transferTypes/new', component: TransferTypeFormComponent },
            { path: 'transferTypes/:id', component: TransferTypeFormComponent },

            { path: 'transfers', component: TransferListComponent },

            { path: 'login', component: LoginComponent }
        ])
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
    bootstrap: [RootComponent]
})

export class AppModule { }
