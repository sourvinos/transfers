import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { CustomerModule } from '../customers/classes/customer.module';
import { DestinationModule } from '../destinations/user-interface/destinations.module';
import { DriverModule } from '../drivers/classes/driver.module';
import { LoginComponent } from '../login/user-interface/form-login';
import { PickupPointModule } from '../pickupPoints/classes/pickup-point.module';
import { PortModule } from '../ports/classes/port.module';
import { RouteModule } from '../routes/classes/route.module';
import { EmptyPageComponent } from '../shared/components/empty-page/empty-page.component';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { DomChangeDirective } from '../shared/directives/dom-change.directive';
import { MaterialModule } from '../shared/modules/material.module';
import { HttpErrorInterceptor } from '../shared/services/error.interceptor';
import { JwtInterceptor } from '../shared/services/jwt.interceptor';
import { UserModule } from '../users/classes/user.module';
import { HomeComponent } from './../home/home.component';
import { MainComponent } from './../shared/components/main/main.component';
import { TransferModule } from './../transfers/classes/transfer.module';
import { AppRoutingModule } from './app-routing.module';
import { RootComponent } from './root.component';

@NgModule({
    declarations: [
        MainComponent,
        RootComponent,
        HomeComponent,
        LoginComponent,
        SidebarComponent,
        DomChangeDirective,
        EmptyPageComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MaterialModule,
        CustomerModule,
        DestinationModule,
        DriverModule,
        PortModule,
        RouteModule,
        PickupPointModule,
        TransferModule,
        UserModule,
        NgIdleKeepaliveModule.forRoot(),
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
    ],
    bootstrap: [RootComponent]
})

export class AppModule { }
