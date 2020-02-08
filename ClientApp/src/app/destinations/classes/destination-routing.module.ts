import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { DestinationFormComponent } from "../user-interface/form-destination";
import { DestinationListComponent } from "../user-interface/list-destination";
import { AuthGuardService } from './../../shared/services/auth-guard.service';
import { CanDeactivateGuard } from './../../shared/services/can-deactivate-guard.service';
import { DestinationListResolverService } from './resolver-list-destination';

const appRoutes: Routes = [
    { path: '', component: DestinationListComponent, canActivate: [AuthGuardService], resolve: { destinationList: DestinationListResolverService } },
    { path: 'new', component: DestinationFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: ':id', component: DestinationFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] }
]

@NgModule({
    imports: [
        RouterModule.forChild(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class DestinationRoutingModule { }