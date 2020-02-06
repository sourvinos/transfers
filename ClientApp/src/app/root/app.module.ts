import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { CustomerFormComponent } from '../customers/user-interface/form-customer';
import { CustomerListComponent } from '../customers/user-interface/list-customer';
import { LoginComponent } from '../login/user-interface/form-login';
import { RegisterComponent } from '../register/user-interface/form-register';
import { DialogAlertComponent } from '../shared/components/dialog-alert/dialog-alert.component';
import { DialogIndexComponent } from '../shared/components/dialog-index/dialog-index.component';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { CustomTableComponent } from '../shared/components/table/custom-table';
import { DomChangeDirective } from '../shared/directives/dom-change.directive';
import { MaterialModule } from '../shared/modules/material.module';
import { SafeStylePipe } from '../shared/pipes/safeStyle';
import { HttpErrorInterceptor } from '../shared/services/error.interceptor';
import { JwtInterceptor } from '../shared/services/jwt.interceptor';
import { DestinationFormComponent } from './../destinations/user-interface/form-destination';
import { DestinationListComponent } from './../destinations/user-interface/list-destination';
import { DriverFormComponent } from './../drivers/user-interface/form-driver';
import { DriverListComponent } from './../drivers/user-interface/list-driver';
import { HomeComponent } from './../home/home.component';
import { FormPickupPointComponent } from './../pickupPoints/user-interface/form-pickupPoint';
import { ListPickupPointComponent } from './../pickupPoints/user-interface/list-pickupPoint';
import { WrapperPickupPointComponent } from './../pickupPoints/user-interface/wrapper-pickupPoint';
import { PortFormComponent } from './../ports/user-interface/form-port';
import { PortListComponent } from './../ports/user-interface/list-port';
import { RouteFormComponent } from './../routes/user-interface/form-route';
import { RouteListComponent } from './../routes/user-interface/list-route';
import { MainComponent } from './../shared/components/main/main.component';
import { InputFormatDirective } from './../shared/directives/input-format.directive';
import { InputTabStopDirective } from './../shared/directives/input-tabstop.directive';
import { DialogAssignDriverComponent } from './../transfers/user-interface/dialog-assign-driver';
import { FormTransferComponent } from './../transfers/user-interface/form-transfer';
import { ListTransferComponent } from './../transfers/user-interface/list-transfer';
import { TableTransferComponent } from './../transfers/user-interface/table-transfer';
import { WrapperTransferComponent } from './../transfers/user-interface/wrapper-transfer';
import { UserFormComponent } from './../users/user-interface/form-user';
import { UserListComponent } from './../users/user-interface/list-user';
import { AppRoutingModule } from './app-routing.module';
import { RootComponent } from './root.component';

@NgModule({
    declarations: [
        MainComponent,
        RootComponent,
        HomeComponent,
        LoginComponent,
        SidebarComponent,
        CustomerListComponent, CustomerFormComponent,
        DestinationListComponent, DestinationFormComponent,
        DriverListComponent, DriverFormComponent,
        PortListComponent, PortFormComponent,
        RegisterComponent,
        RouteListComponent, RouteFormComponent,
        WrapperPickupPointComponent, ListPickupPointComponent, FormPickupPointComponent,
        WrapperTransferComponent, ListTransferComponent, FormTransferComponent, TableTransferComponent, DialogAssignDriverComponent,
        UserListComponent, UserFormComponent,
        CustomTableComponent,
        DialogAlertComponent,
        DialogIndexComponent,
        DomChangeDirective,
        InputTabStopDirective,
        InputFormatDirective,
        SafeStylePipe,
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
