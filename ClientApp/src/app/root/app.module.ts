// Base
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

// Services
import { AuthInterceptor } from '../services/auth.interceptor';
import { AuthGuard } from './../services/auth.guard';

// Common
import { MainComponent } from './../shared/components/main/main.component';
import { RootComponent } from './root.component';
import { SidebarComponent } from './../shared/sidebar/sidebar.component';

// Routes
import { HomeComponent } from './../home/home.component';
import { LoginComponent } from '../login/login.component';
import { CustomerFormComponent } from '../customers/customer-form.component';
import { CustomerListComponent } from '../customers/customer-list.component';
import { DestinationFormComponent } from '../destinations/destination-form.component';
import { DestinationListComponent } from '../destinations/destination-list.component';
import { PickupPointFormComponent } from '../pickupPoints/pickupPoint-form.component';
import { PickupPointListComponent } from './../pickupPoints/pickupPoint-list.component';
import { RouteFormComponent } from '../routes/route-form.component';
import { RouteListComponent } from '../routes/route-list.component';
import { TaxOfficeFormComponent } from '../taxOffices/taxOffice-form.component';
import { TaxOfficeListComponent } from '../taxOffices/taxOffice-list.component';
import { TransferFormComponent } from '../transfers/transfer-form.component';
import { TransferListComponent } from '../transfers/transfer-list.component';
import { VatStateFormComponent } from '../vatStates/vatState-form.component';
import { VatStateListComponent } from '../vatStates/vatState-list.component';

// Directives
import { InputFormatDirective } from '../directives/input-format.directive';

@NgModule({
    declarations: [
        // Common
        MainComponent,
        RootComponent,
        SidebarComponent,
        // Routes
        HomeComponent,
        LoginComponent,
        CustomerFormComponent, CustomerListComponent,
        DestinationFormComponent, DestinationListComponent,
        PickupPointFormComponent, PickupPointListComponent,
        RouteFormComponent, RouteListComponent,
        TaxOfficeFormComponent, TaxOfficeListComponent,
        TransferFormComponent, TransferListComponent,
        VatStateFormComponent, VatStateListComponent,
        // Directives
        InputFormatDirective
    ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule
    ],
    entryComponents: [],
    providers: [AuthGuard, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
    bootstrap: [RootComponent]
})

export class AppModule { }
