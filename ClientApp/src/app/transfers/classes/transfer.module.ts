import { MaterialModule } from './../../shared/modules/material.module';
import { SharedModule } from './../../shared/modules/shared.module';
import { NgModule } from '@angular/core';
import { TransferWrapperComponent } from '../user-interface/transfer-wrapper';
import { TransferListComponent } from '../user-interface/transfer-list';
import { TransferFormComponent } from '../user-interface/transfer-form';
import { TransferAssignDriverComponent } from '../user-interface/transfer-assign-driver';

@NgModule({
    declarations: [
        TransferWrapperComponent,
        TransferListComponent,
        TransferFormComponent,
        TransferAssignDriverComponent
    ],
    imports: [
        SharedModule,
        MaterialModule
    ],
    entryComponents: [
        TransferAssignDriverComponent
    ]
})

export class TransferModule { }
