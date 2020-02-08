import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from '../home/home.component'
import { LoginComponent } from '../login/user-interface/form-login'
import { EmptyPageComponent } from '../shared/components/empty-page/empty-page.component';
import { AuthGuardService } from '../shared/services/auth-guard.service'

const appRoutes: Routes = [
	{ path: '', component: HomeComponent, canActivate: [AuthGuardService], pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'customers', loadChildren: '../customers/classes/customer.module#CustomerModule' },
	{ path: 'destinations', loadChildren: '../destinations/classes/destination.module#DestinationModule' },
	{ path: 'drivers', loadChildren: '../drivers/classes/driver.module#DriverModule' },
	{ path: 'ports', loadChildren: '../ports/classes/port.module#PortModule' },
	{ path: 'routes', loadChildren: '../routes/classes/route.module#RouteModule' },
	// {
	// 	path: 'pickupPoints', component: WrapperPickupPointComponent, canActivate: [AuthGuardService], children: [
	// 		{
	// 			path: 'routeId/:routeId', component: ListPickupPointComponent, canActivate: [AuthGuardService], resolve: { pickupPointList: PickupPointListResolverService }, children: [
	// 				{ path: 'pickupPoint/new', component: FormPickupPointComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
	// 				{ path: 'pickupPoint/:pickupPointId', component: FormPickupPointComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }
	// 			], runGuardsAndResolvers: 'always'
	// 		}]
	// },
	// {
	// 	path: 'transfers', component: WrapperTransferComponent, canActivate: [AuthGuardService], children: [
	// 		{
	// 			path: 'dateIn/:dateIn', component: ListTransferComponent, canActivate: [AuthGuardService], resolve: { transferList: TransferListResolverService }, children: [
	// 				{ path: 'transfer/new', component: FormTransferComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
	// 				{ path: 'transfer/:transferId', component: FormTransferComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { transferForm: TransferEditResolverService } }
	// 			], runGuardsAndResolvers: 'always'
	// 		}]
	// },
	// { path: 'users', component: ListUserComponent, canActivate: [AuthGuardService], resolve: { userList: UserListResolverService } }, { path: 'users/new', component: FormUserComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }, { path: 'users/:id', component: FormUserComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
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

export class AppRoutingModule { }