import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { LoginComponent } from '../login/user-interface/form-login';
import { EmptyPageComponent } from '../shared/components/empty-page/empty-page.component';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { DomChangeDirective } from '../shared/directives/dom-change.directive';
import { MaterialModule } from '../shared/modules/material.module';
import { HttpErrorInterceptor } from '../shared/services/error.interceptor';
import { JwtInterceptor } from '../shared/services/jwt.interceptor';
import { HomeComponent } from './../home/home.component';
import { MainComponent } from './../shared/components/main/main.component';
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
        NgIdleKeepaliveModule.forRoot(),
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
    ],
    bootstrap: [RootComponent]
})

export class AppModule { }
