import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "src/app/shared/services/auth-guard.service";
import { CanDeactivateGuard } from "src/app/shared/services/can-deactivate-guard.service";
import { RouteFormComponent } from "../user-interface/form-route";
import { RouteListComponent } from "../user-interface/list-route";
import { RouteListResolverService } from "./resolver-list-route";

const appRoutes: Routes = [
    { path: '', component: RouteListComponent, canActivate: [AuthGuardService], resolve: { routeList: RouteListResolverService } },
    { path: 'new', component: RouteFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: ':id', component: RouteFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }
]

@NgModule({
    imports: [
        RouterModule.forChild(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class RouteRoutingModule { }