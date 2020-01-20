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
import { MatDialogModule, MatListModule, MAT_LABEL_GLOBAL_OPTIONS, MatExpansionModule, MatCheckboxModule } from '@angular/material'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar'
import { MatTableModule } from '@angular/material/table'
// Services
import { JwtInterceptor } from '../services/jwt.interceptor'
import { HttpErrorInterceptor } from '../services/error.interceptor'
// Common components
import { RootComponent } from './root.component'
import { MainComponent } from './../shared/components/main/main.component'
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component'
import { TableComponent } from '../shared/components/table/table.component'
import { PageNotFoundComponent } from '../shared/components/page-not-found/page-not-found.component'
import { LoaderComponent } from '../shared/components/loader/loader.component'
import { DialogIndexComponent } from '../shared/components/dialog-index/dialog-index.component'
import { DialogAlertComponent } from '../shared/components/dialog-alert/dialog-alert.component'
import { DialogAssignDriverComponent } from '../transfers/user-interface/dialog-assign-driver'
// Routes
import { HomeComponent } from './../home/home.component'
import { LoginComponent } from '../login/user-interface/form-login'
import { CustomerListComponent } from '../customers/user-interface/list-customer'; import { CustomerFormComponent } from '../customers/user-interface/form-customer'
import { DestinationListComponent } from '../destinations/destination-list.component'; import { DestinationFormComponent } from '../destinations/destination-form.component'
import { DriverListComponent } from './../drivers/driver-list.component'; import { DriverFormComponent } from './../drivers/driver-form.component'
import { PortListComponent } from './../ports/port-list.component'; import { PortFormComponent } from './../ports/port-form.component'
import { RouteListComponent } from '../routes/route-list.component'; import { RouteFormComponent } from '../routes/route-form.component'
import { TaxOfficeListComponent } from '../taxOffices/taxOffice-list.component'; import { TaxOfficeFormComponent } from '../taxOffices/taxOffice-form.component'
import { WrapperTransferComponent } from '../transfers/user-interface/wrapper-transfer'; import { ListTransferComponent } from '../transfers/user-interface/list-transfer'; import { FormTransferComponent } from '../transfers/user-interface/form-transfer'; import { TableTransferComponent } from '../transfers/user-interface/table-transfer'
import { VatStateListComponent } from '../vatStates/vatState-list.component'; import { VatStateFormComponent } from '../vatStates/vatState-form.component'
import { WrapperPickupPointComponent } from '../pickupPoints/user-interface/wrapper-pickupPoint'; import { ListPickupPointComponent } from '../pickupPoints/user-interface/list-pickupPoint'; import { FormPickupPointComponent } from '../pickupPoints/user-interface/form-pickupPoint'; import { TablePickupPointComponent } from '../pickupPoints/user-interface/table-pickupPoint'
// Directives
import { InputTabStopDirective } from '../directives/input-tabstop.directive'
import { InputFormatDirective } from '../directives/input-format.directive'
import { DomChangeDirective } from '../directives/dom-change.directive'
// Pipes
import { CustomPipe } from '../pipes/custom.pipe'
import { SafeStylePipe } from './../pipes/safeStyle'

@NgModule({
    declarations: [
        // Common
        MainComponent,
        RootComponent,
        SidebarComponent,
        LoaderComponent,
        PageNotFoundComponent,
        DialogIndexComponent,
        DialogAlertComponent,
        DialogAssignDriverComponent,
        TableComponent,
        // Routes
        HomeComponent,
        LoginComponent,
        CustomerListComponent, CustomerFormComponent,
        DestinationListComponent, DestinationFormComponent,
        DriverListComponent, DriverFormComponent,
        PortListComponent, PortFormComponent,
        RouteListComponent, RouteFormComponent,
        TaxOfficeListComponent, TaxOfficeFormComponent,
        WrapperTransferComponent, ListTransferComponent, FormTransferComponent, TableTransferComponent,
        WrapperPickupPointComponent, ListPickupPointComponent, FormPickupPointComponent, TablePickupPointComponent,
        VatStateListComponent, VatStateFormComponent,
        // Directives
        InputTabStopDirective,
        InputFormatDirective,
        DomChangeDirective,
        // Pipes
        CustomPipe,
        SafeStylePipe
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
        MatCheckboxModule,
        MatCheckboxModule,
        MatDialogModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatSelectModule,
        MatSnackBarModule,
        MatTableModule,
    ],
    entryComponents: [
        DialogIndexComponent,
        DialogAlertComponent,
        DialogAssignDriverComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
        { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'always' } },
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 1000 } }
    ],
    bootstrap: [RootComponent]
})

export class AppModule { }
