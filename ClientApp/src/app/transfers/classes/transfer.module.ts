import { MaterialModule } from './../../shared/modules/material.module';
import { SharedModule } from './../../shared/modules/shared.module';
import { NgModule } from '@angular/core';
import { WrapperTransferComponent } from '../user-interface/wrapper-transfer';
import { ListTransferComponent } from '../user-interface/list-transfer';
import { FormTransferComponent } from '../user-interface/form-transfer';
import { DialogAssignDriverComponent } from '../user-interface/dialog-assign-driver';
import { TableTransferComponent } from '../user-interface/table-transfer';

@NgModule({
    declarations: [
        WrapperTransferComponent,
        ListTransferComponent,
        FormTransferComponent,
        TableTransferComponent,
        DialogAssignDriverComponent
    ],
    imports: [
        SharedModule,
        MaterialModule
    ],
    entryComponents: [
        DialogAssignDriverComponent
    ]
})

export class TransferModule { }
