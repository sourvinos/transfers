import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { FormTransferComponent } from '../user-interface/form-transfer';
import { ListTransferComponent } from '../user-interface/list-transfer';
import { TableTransferComponent } from '../user-interface/table-transfer';
import { WrapperTransferComponent } from '../user-interface/wrapper-transfer';
import { TransferRouting } from './routing.transfer';

@NgModule({
    declarations: [
        WrapperTransferComponent,
        ListTransferComponent,
        FormTransferComponent,
        TableTransferComponent
    ],
    imports: [
        TransferRouting,
        SharedModule,
        MaterialModule
    ]
})

export class TransferModule { }
