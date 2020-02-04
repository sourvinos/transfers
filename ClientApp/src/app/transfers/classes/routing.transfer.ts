import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "src/app/services/auth-guard.service";
import { CanDeactivateGuard } from "src/app/services/can-deactivate-guard.service";
import { FormTransferComponent } from "../user-interface/form-transfer";
import { ListTransferComponent } from "../user-interface/list-transfer";
import { WrapperTransferComponent } from "../user-interface/wrapper-transfer";
import { TransferListResolverService } from "./resolver-list-transfer";
import { TransferEditResolverService } from "./resolver-edit-transfer";

const appRoutes: Routes = [
    {
        path: '', component: WrapperTransferComponent, canActivate: [AuthGuardService], children: [
            {
                path: 'dateIn/:dateIn', component: ListTransferComponent, canActivate: [AuthGuardService], resolve: { transferList: TransferListResolverService }, children: [
                    { path: 'transfer/new', component: FormTransferComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
                    { path: 'transfer/:transferId', component: FormTransferComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { transferForm: TransferEditResolverService } }
                ], runGuardsAndResolvers: 'always'
            }]
    }
]

@NgModule({
    declarations: [],
    entryComponents: [],
    imports: [
        RouterModule.forChild(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class TransferRouting { }