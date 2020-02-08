import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "src/app/shared/services/auth-guard.service";
import { CanDeactivateGuard } from "src/app/shared/services/can-deactivate-guard.service";
import { DriverFormComponent } from "../user-interface/form-driver";
import { DriverListComponent } from "../user-interface/list-driver";
import { DriverListResolverService } from "./resolver-list-driver";

const appRoutes: Routes = [
    { path: '', component: DriverListComponent, canActivate: [AuthGuardService], resolve: { driverList: DriverListResolverService } },
    { path: 'new', component: DriverFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: ':id', component: DriverFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }
]

@NgModule({
    imports: [
        RouterModule.forChild(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class DriverRoutingModule { }