import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "src/app/shared/services/auth-guard.service";
import { CanDeactivateGuard } from "src/app/shared/services/can-deactivate-guard.service";
import { CustomerFormComponent } from "../user-interface/form-customer";
import { CustomerListComponent } from "../user-interface/list-customer";
import { CustomerListResolverService } from "./resolver-list-customer";

const appRoutes: Routes = [
    { path: '', component: CustomerListComponent, canActivate: [AuthGuardService], resolve: { customerList: CustomerListResolverService } },
    { path: 'new', component: CustomerFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: ':id', component: CustomerFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }
]

@NgModule({
    imports: [
        RouterModule.forChild(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class CustomerRoutingModule { }