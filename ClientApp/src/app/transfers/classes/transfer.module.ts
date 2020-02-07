import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { MaterialModule } from '../../shared/modules/material.module';
import { FormTransferComponent } from '../user-interface/form-transfer';
import { ListTransferComponent } from '../user-interface/list-transfer';
import { WrapperTransferComponent } from '../user-interface/wrapper-transfer';
import { TableTransferComponent } from '../user-interface/table-transfer';

@NgModule({
    declarations: [
        WrapperTransferComponent,
        ListTransferComponent,
        FormTransferComponent,
        TableTransferComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        MaterialModule
    ]
})

export class TransferModule { }
