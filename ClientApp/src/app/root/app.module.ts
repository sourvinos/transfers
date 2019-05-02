import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RootComponent } from './root.component';
import { RouterModule } from '@angular/router';

import { MAT_LABEL_GLOBAL_OPTIONS } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material';
import { MatDialogModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FooterComponent } from '../shared/components/footer/footer.component';
import { LoginComponent } from '../login/login.component';
import { MainComponent } from '../shared/components/main/main.component';
import { MenuComponent } from '../shared/components/menu/menu.component';
import { NavigationComponent } from '../shared/components/navigation/navigation.component';
import { UserInfoComponent } from '../shared/components/user-info/user-info.component';

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

@NgModule({
    declarations: [
        RootComponent,
        UserInfoComponent,
        NavigationComponent,
        HomeComponent,
        MenuComponent,
        MainComponent,
        FooterComponent,
        LoginComponent,
        DeleteDialogComponent,
        MessageDialogComponent,
        CustomerListComponent, CustomerFormComponent,
        RouteListComponent, RouteFormComponent,
        PickupPointListComponent, PickupPointFormComponent
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
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatSnackBarModule,
        MatToolbarModule,
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

            { path: 'login', component: LoginComponent }
        ])
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'always' } }

    ],
    bootstrap: [RootComponent]
})

export class AppModule { }
