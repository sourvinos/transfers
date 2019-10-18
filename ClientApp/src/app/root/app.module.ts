// Base
import { AppRoutingModule } from './app-routing.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { ModalModule } from 'ngx-bootstrap/modal'
import { ButtonsModule } from 'ngx-bootstrap/buttons';
// Services
import { JwtInterceptor } from '../services/jwt.interceptor'
// Common components
import { MainComponent } from './../shared/components/main/main.component'
import { RootComponent } from './root.component'
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component'
import { LoaderComponent } from '../shared/components/loader/loader.component'
import { PageNotFoundComponent } from '../shared/components/page-not-found/page-not-found.component'
import { ModalDialogComponent } from '../shared/components/modal-dialog/modal-dialog.component'
// Routes
import { CustomerFormComponent } from '../customers/customer-form.component'
import { CustomerListComponent } from '../customers/customer-list.component'
import { DestinationFormComponent } from '../destinations/destination-form.component'
import { DestinationListComponent } from '../destinations/destination-list.component'
import { DriverFormComponent } from './../drivers/driver-form.component'
import { DriverListComponent } from './../drivers/driver-list.component'
import { HomeComponent } from './../home/home.component'
import { LoginComponent } from '../login/login.component'
import { PickupPointFormComponent } from '../pickupPoints/pickupPoint-form.component'
import { PickupPointListComponent } from './../pickupPoints/pickupPoint-list.component'
import { PortFormComponent } from './../ports/port-form.component'
import { PortListComponent } from './../ports/port-list.component'
import { RouteFormComponent } from '../routes/route-form.component'
import { RouteListComponent } from '../routes/route-list.component'
import { TaxOfficeFormComponent } from '../taxOffices/taxOffice-form.component'
import { TaxOfficeListComponent } from '../taxOffices/taxOffice-list.component'
import { TransfersComponent } from '../transfers/transfers-component'
import { TransferListComponent } from '../transfers/transfer-list.component'
import { TransferFormComponent } from '../transfers/transfer-form.component'
import { VatStateFormComponent } from '../vatStates/vatState-form.component'
import { VatStateListComponent } from '../vatStates/vatState-list.component'
// Directives
import { InputFormatDirective } from '../directives/input-format.directive'

@NgModule({
    declarations: [
        // Common
        MainComponent,
        RootComponent,
        SidebarComponent,
        LoaderComponent,
        PageNotFoundComponent,
        ModalDialogComponent,
        // Routes
        HomeComponent,
        LoginComponent,
        CustomerFormComponent, CustomerListComponent,
        DestinationFormComponent, DestinationListComponent,
        DriverFormComponent, DriverListComponent,
        PickupPointFormComponent, PickupPointListComponent,
        PortFormComponent, PortListComponent,
        RouteFormComponent, RouteListComponent,
        TaxOfficeFormComponent, TaxOfficeListComponent,
        TransfersComponent, TransferListComponent, TransferFormComponent,
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
        ReactiveFormsModule,
        NgIdleKeepaliveModule.forRoot(),
        ModalModule.forRoot(),
        ButtonsModule.forRoot()
    ],
    entryComponents: [
        ModalDialogComponent
    ],
    providers: [],
    bootstrap: [RootComponent]
})

export class AppModule { }
