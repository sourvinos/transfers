// Base
import { AppRoutingModule } from './app-routing.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
// Services
import { JwtInterceptor } from '../services/jwt.interceptor'
import { HttpErrorInterceptor } from '../services/error.interceptor'
// Common components
import { RootComponent } from './root.component'
import { MainComponent } from './../shared/components/main/main.component'
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component'
import { CustomTableComponent } from '../shared/components/table/custom-table'
import { DialogIndexComponent } from '../shared/components/dialog-index/dialog-index.component'
import { DialogAlertComponent } from '../shared/components/dialog-alert/dialog-alert.component'
import { DialogAssignDriverComponent } from '../transfers/user-interface/dialog-assign-driver'
// Routes
import { HomeComponent } from './../home/home.component'
import { LoginComponent } from '../login/user-interface/form-login'
import { CustomerListComponent } from '../customers/user-interface/list-customer'; import { CustomerFormComponent } from '../customers/user-interface/form-customer'
import { DestinationListComponent } from '../destinations/user-interface/list-destination'; import { DestinationFormComponent } from '../destinations/user-interface/form-destination'
import { DriverListComponent } from '../drivers/user-interface/list-driver'; import { DriverFormComponent } from '../drivers/user-interface/form-driver'
import { PortListComponent } from '../ports/user-interface/list-port'; import { PortFormComponent } from '../ports/user-interface/form-port'
import { RouteListComponent } from '../routes/user-interface/list-route'; import { RouteFormComponent } from '../routes/user-interface/form-route'
import { WrapperPickupPointComponent } from '../pickupPoints/user-interface/wrapper-pickupPoint'; import { ListPickupPointComponent } from '../pickupPoints/user-interface/list-pickupPoint'; import { FormPickupPointComponent } from '../pickupPoints/user-interface/form-pickupPoint'; import { TablePickupPointComponent } from '../pickupPoints/user-interface/table-pickupPoint'
import { RegisterComponent } from './../register/user-interface/form-register'
import { UserListComponent } from './../users/user-interface/list-user'; import { UserFormComponent } from './../users/user-interface/form-user'
import { DomChangeDirective } from '../shared/directives/dom-change.directive'
// Pipes
import { SafeStylePipe } from '../shared/pipes/safeStyle'
import { MaterialModule } from '../shared/modules/material.module';

@NgModule({
    declarations: [
        // Common
        MainComponent,
        RootComponent,
        SidebarComponent,
        DialogIndexComponent,
        DialogAlertComponent,
        DialogAssignDriverComponent,
        CustomTableComponent,
        // Routes
        HomeComponent,
        LoginComponent,
        // CustomerListComponent, CustomerFormComponent,
        // DestinationListComponent, DestinationFormComponent,
        // DriverListComponent, DriverFormComponent,
        // PortListComponent, PortFormComponent,
        // RouteListComponent, RouteFormComponent,
        // WrapperPickupPointComponent, ListPickupPointComponent, FormPickupPointComponent, TablePickupPointComponent,
        // UserListComponent, UserFormComponent,
        // RegisterComponent,
        DomChangeDirective,
        // Pipes
        SafeStylePipe
    ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MaterialModule,
        NgIdleKeepaliveModule.forRoot(),
    ],
    entryComponents: [
        DialogIndexComponent,
        DialogAlertComponent,
        DialogAssignDriverComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
    ],
    bootstrap: [RootComponent]
})

export class AppModule { }
