import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
// Routes
import { HomeComponent } from '../home/home.component'
import { LoginComponent } from '../login/user-interface/form-login'
import { CustomerListComponent } from '../customers/user-interface/list-customer'; import { CustomerFormComponent } from '../customers/user-interface/form-customer'
import { DestinationListComponent } from './../destinations/user-interface/list-destination'; import { DestinationFormComponent } from '../destinations/user-interface/form-destination'
import { DriverListComponent } from '../drivers/user-interface/list-driver'; import { DriverFormComponent } from '../drivers/user-interface/form-driver'
import { PortListComponent } from './../ports/user-interface/list-port'; import { PortFormComponent } from '../ports/user-interface/form-port'
import { RegisterComponent } from './../register/user-interface/form-register'
import { RouteListComponent } from '../routes/user-interface/list-route'; import { RouteFormComponent } from '../routes/user-interface/form-route'
import { WrapperPickupPointComponent } from '../pickupPoints/user-interface/wrapper-pickupPoint'; import { ListPickupPointComponent } from '../pickupPoints/user-interface/list-pickupPoint'; import { FormPickupPointComponent } from '../pickupPoints/user-interface/form-pickupPoint'
import { WrapperTransferComponent } from '../transfers/user-interface/wrapper-transfer'; import { ListTransferComponent } from '../transfers/user-interface/list-transfer'; import { FormTransferComponent } from '../transfers/user-interface/form-transfer'
import { UserListComponent } from '../users/user-interface/list-user'; import { UserFormComponent } from '../users/user-interface/form-user';

// Guards
import { AuthGuardService } from '../services/auth-guard.service'
import { CanDeactivateGuard } from '../services/can-deactivate-guard.service'
// Resolvers
import { CustomerListResolverService } from '../customers/classes/resolver-list-customer'
import { DestinationListResolverService } from '../destinations/classes/resolver-list-destination'
import { DriverListResolverService } from '../drivers/classes/resolver-list-driver'
import { PickupPointListResolverService } from '../pickupPoints/classes/resolver-list-pickupPoint'
import { RouteListResolverService } from '../routes/classes/resolver-list-route'
import { TransferEditResolverService } from '../transfers/classes/resolver-edit-transfer'
import { TransferListResolverService } from '../transfers/classes/resolver-list-transfer'
import { PortListResolverService } from '../ports/classes/resolver-list-port'
import { UserListResolverService } from '../users/classes/resolver-list-user';

const appRoutes: Routes = [
	{ path: '', component: HomeComponent, canActivate: [AuthGuardService], pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	// { path: 'customers', component: CustomerListComponent, canActivate: [AuthGuardService], resolve: { customerList: CustomerListResolverService } }, { path: 'customers/new', component: CustomerFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }, { path: 'customers/:id', component: CustomerFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
	// { path: 'destinations', component: DestinationListComponent, canActivate: [AuthGuardService], resolve: { destinationList: DestinationListResolverService } }, { path: 'destinations/new', component: DestinationFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }, { path: 'destinations/:id', component: DestinationFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
	// { path: 'drivers', component: DriverListComponent, canActivate: [AuthGuardService], resolve: { driverList: DriverListResolverService } }, { path: 'drivers/new', component: DriverFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }, { path: 'drivers/:id', component: DriverFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
	// {
	// 	path: 'pickupPoints', component: WrapperPickupPointComponent, canActivate: [AuthGuardService], children: [
	// 		{
	// 			path: 'routeId/:routeId', component: ListPickupPointComponent, canActivate: [AuthGuardService], resolve: { pickupPointList: PickupPointListResolverService }, children: [
	// 				{ path: 'pickupPoint/new', component: FormPickupPointComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
	// 				{ path: 'pickupPoint/:pickupPointId', component: FormPickupPointComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }
	// 			], runGuardsAndResolvers: 'always'
	// 		}]
	// },
	// { path: 'ports', component: PortListComponent, canActivate: [AuthGuardService], resolve: { portList: PortListResolverService } }, { path: 'ports/new', component: PortFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }, { path: 'ports/:id', component: PortFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
	// { path: 'routes', component: RouteListComponent, canActivate: [AuthGuardService], resolve: { routeList: RouteListResolverService } }, { path: 'routes/new', component: RouteFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }, { path: 'routes/:id', component: RouteFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
	{ path: 'transfers', loadChildren: '../transfers/classes/module-transfer#TransferModule' },
	// {
	// 	path: 'transfers', component: WrapperTransferComponent, canActivate: [AuthGuardService], children: [
	// 		{
	// 			path: 'dateIn/:dateIn', component: ListTransferComponent, canActivate: [AuthGuardService], resolve: { transferList: TransferListResolverService }, children: [
	// 				{ path: 'transfer/new', component: FormTransferComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
	// 				{ path: 'transfer/:transferId', component: FormTransferComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { transferForm: TransferEditResolverService } }
	// 			], runGuardsAndResolvers: 'always'
	// 		}]
	// },
	// { path: 'users', component: UserListComponent, canActivate: [AuthGuardService], resolve: { userList: UserListResolverService } }, { path: 'users/:id', component: UserFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
	// { path: 'register', component: RegisterComponent, canActivate: [AuthGuardService] },
	{ path: '**', component: LoginComponent }
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

export class AppRoutingModule { }