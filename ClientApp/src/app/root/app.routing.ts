import { CustomerListResolver } from './../customers/classes/customer-list.resolver';
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
// Routes
import { HomeComponent } from '../home/home.component'
import { LoginFormComponent } from '../login/user-interface/login-form'
import { CustomerListComponent } from '../customers/user-interface/customer-list'; import { CustomerFormComponent } from '../customers/user-interface/customer-form'
import { DestinationListComponent } from '../destinations/user-interface/destination-list'; import { DestinationFormComponent } from '../destinations/user-interface/destination-form'
import { DriverListComponent } from '../drivers/user-interface/driver-list'; import { DriverFormComponent } from '../drivers/user-interface/driver-form'
import { PortListComponent } from '../ports/user-interface/port-list'; import { PortFormComponent } from '../ports/user-interface/port-form'
import { RegisterFormComponent } from '../register/user-interface/register-form'
import { RouteListComponent } from '../routes/user-interface/route-list'; import { RouteFormComponent } from '../routes/user-interface/route-form'
import { WrapperTransferComponent } from '../transfers/user-interface/wrapper-transfer'; import { ListTransferComponent } from '../transfers/user-interface/list-transfer'; import { FormTransferComponent } from '../transfers/user-interface/form-transfer'
import { UserListComponent } from '../users/user-interface/user-list'; import { UserFormComponent } from '../users/user-interface/user-form';
import { EmptyPageComponent } from '../shared/components/empty-page/empty-page.component';
// Guards
import { AuthGuardService } from '../shared/services/auth-guard.service'
import { CanDeactivateGuard } from '../shared/services/can-deactivate-guard.service'
// Resolvers
import { DestinationListResolver } from '../destinations/classes/destination-list.resolver'
import { DriverListResolver } from '../drivers/classes/driver-list.resolver'
import { PickupPointListResolver } from '../pickupPoints/classes/pickupPoint-list.resolver'
import { PortListResolver } from '../ports/classes/port-list.resolver'
import { RouteListResolver } from '../routes/classes/route-list.resolver'
import { TransferListResolver } from '../transfers/classes/transfer-list.resolver'
import { UserListResolver } from '../users/classes/user-list.resolver';
import { PickupPointWrapperComponent } from '../pickupPoints/user-interface/pickupPoint-wrapper';
import { PickupPointListComponent } from '../pickupPoints/user-interface/pickupPoint-list';
import { PickupPointFormComponent } from '../pickupPoints/user-interface/pickupPoint-form';
import { TransferFormResolver } from '../transfers/classes/transfer-form.resolver';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuardService], pathMatch: 'full' },
    { path: 'login', component: LoginFormComponent },
    { path: 'customers', component: CustomerListComponent, canActivate: [AuthGuardService], resolve: { customerList: CustomerListResolver } }, { path: 'customers/new', component: CustomerFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }, { path: 'customers/:id', component: CustomerFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: 'destinations', component: DestinationListComponent, canActivate: [AuthGuardService], resolve: { destinationList: DestinationListResolver } }, { path: 'destinations/new', component: DestinationFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }, { path: 'destinations/:id', component: DestinationFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: 'drivers', component: DriverListComponent, canActivate: [AuthGuardService], resolve: { driverList: DriverListResolver } }, { path: 'drivers/new', component: DriverFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }, { path: 'drivers/:id', component: DriverFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    {
        path: 'pickupPoints', component: PickupPointWrapperComponent, canActivate: [AuthGuardService], children: [
            {
                path: 'routeId/:routeId', component: PickupPointListComponent, canActivate: [AuthGuardService], resolve: { pickupPointList: PickupPointListResolver }, children: [
                    { path: 'pickupPoint/new', component: PickupPointFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
                    { path: 'pickupPoint/:pickupPointId', component: PickupPointFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }
                ], runGuardsAndResolvers: 'always'
            }]
    },
    { path: 'ports', component: PortListComponent, canActivate: [AuthGuardService], resolve: { portList: PortListResolver } }, { path: 'ports/new', component: PortFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }, { path: 'ports/:id', component: PortFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: 'routes', component: RouteListComponent, canActivate: [AuthGuardService], resolve: { routeList: RouteListResolver } }, { path: 'routes/new', component: RouteFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }, { path: 'routes/:id', component: RouteFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    {
        path: 'transfers', component: WrapperTransferComponent, canActivate: [AuthGuardService], children: [
            {
                path: 'dateIn/:dateIn', component: ListTransferComponent, canActivate: [AuthGuardService], resolve: { transferList: TransferListResolver }, children: [
                    { path: 'transfer/new', component: FormTransferComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
                    { path: 'transfer/:transferId', component: FormTransferComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { transferForm: TransferFormResolver } }
                ], runGuardsAndResolvers: 'always'
            }]
    },
    { path: 'users', component: UserListComponent, canActivate: [AuthGuardService], resolve: { userList: UserListResolver } }, { path: 'users/:id', component: UserFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: 'register', component: RegisterFormComponent, canActivate: [AuthGuardService] },
    { path: '**', component: EmptyPageComponent }
]

@NgModule({
    declarations: [],
    entryComponents: [],
    imports: [
        RouterModule.forRoot(appRoutes, { onSameUrlNavigation: 'reload' })
    ],
    exports: [
        RouterModule
    ]
})

export class AppRouting { }
