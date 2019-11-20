// Base
import { AppRoutingModule } from './app-routing.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
// Material
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule, MatListModule, MAT_LABEL_GLOBAL_OPTIONS } from '@angular/material'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table'
import { MaterialDialogComponent } from './../shared/components/material-dialog/material-dialog.component';
import { MaterialIndexDialogComponent } from '../shared/components/material-index-dialog/material-index-dialog.component'
// Services
import { JwtInterceptor } from '../services/jwt.interceptor'
// Common components
import { MainComponent } from './../shared/components/main/main.component'
import { RootComponent } from './root.component'
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component'
import { LoaderComponent } from '../shared/components/loader/loader.component'
import { PageNotFoundComponent } from '../shared/components/page-not-found/page-not-found.component'
// Routes
import { HomeComponent } from './../home/home.component'
import { LoginComponent } from '../login/login.component'
import { CustomerListComponent } from '../customers/customer-list.component'; import { CustomerFormComponent } from '../customers/customer-form.component'
import { DestinationListComponent } from '../destinations/destination-list.component'; import { DestinationFormComponent } from '../destinations/destination-form.component'
import { DriverListComponent } from './../drivers/driver-list.component'; import { DriverFormComponent } from './../drivers/driver-form.component'
import { PickupPointListComponent } from '../pickupPoints/pickupPoint-list.component'; import { PickupPointsForRouteListComponent } from '../pickupPoints/pickupPointsForRoute-list.component'; import { PickupPointFormComponent } from '../pickupPoints/pickupPoint-form.component'
import { PortListComponent } from './../ports/port-list.component'; import { PortFormComponent } from './../ports/port-form.component'
import { RouteListComponent } from '../routes/route-list.component'; import { RouteFormComponent } from '../routes/route-form.component'
import { TaxOfficeListComponent } from '../taxOffices/taxOffice-list.component'; import { TaxOfficeFormComponent } from '../taxOffices/taxOffice-form.component'
import { TransferWrapperComponent } from '../transfers/user-interface/wrapper-transfer'; import { TransferListComponent } from '../transfers/user-interface/list-transfer'; import { TransferFormComponent } from '../transfers/user-interface/form-transfer'
import { VatStateListComponent } from '../vatStates/vatState-list.component'; import { VatStateFormComponent } from '../vatStates/vatState-form.component'
// Directives
import { InputFormatDirective } from '../directives/input-format.directive'
import { MatRowKeyboardSelectionModule } from "mat-row-keyboard-selection";
// Pipes
import { CustomPipe } from '../pipes/custom.pipe'


@NgModule({
    declarations: [
        // Common
        MainComponent,
        RootComponent,
        SidebarComponent,
        LoaderComponent,
        PageNotFoundComponent,
        MaterialIndexDialogComponent,
        MaterialDialogComponent,
        // Routes
        HomeComponent,
        LoginComponent,
        CustomerListComponent, CustomerFormComponent,
        DestinationListComponent, DestinationFormComponent,
        DriverListComponent, DriverFormComponent,
        PickupPointListComponent, PickupPointsForRouteListComponent, PickupPointFormComponent,
        PortListComponent, PortFormComponent,
        RouteListComponent, RouteFormComponent,
        TaxOfficeListComponent, TaxOfficeFormComponent,
        TransferWrapperComponent, TransferListComponent, TransferFormComponent,
        VatStateListComponent, VatStateFormComponent,
        // Directives
        InputFormatDirective,
        // Pipes
        CustomPipe,
    ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        NgIdleKeepaliveModule.forRoot(),
        // Material
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatRowKeyboardSelectionModule,
        MatSelectModule,
        MatSnackBarModule,
        MatTableModule,
        MatTableModule,
    ],
    entryComponents: [
        MaterialIndexDialogComponent,
        MaterialDialogComponent
    ],
    providers: [{ provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'always' } }],
    bootstrap: [RootComponent]
})

export class AppModule { }
