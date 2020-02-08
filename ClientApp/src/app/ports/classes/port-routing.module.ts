import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "src/app/shared/services/auth-guard.service";
import { CanDeactivateGuard } from "src/app/shared/services/can-deactivate-guard.service";
import { PortListComponent } from "../user-interface/list-port";
import { PortFormComponent } from "../user-interface/form-port";
import { PortListResolverService } from "./resolver-list-port";

const appRoutes: Routes = [
    { path: '', component: PortListComponent, canActivate: [AuthGuardService], resolve: { portList: PortListResolverService } },
    { path: 'new', component: PortFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: ':id', component: PortFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }
]

@NgModule({
    imports: [
        RouterModule.forChild(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class PortRoutingModule { }