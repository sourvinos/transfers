import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { FormPickupPointComponent } from '../user-interface/form-pickupPoint';
import { ListPickupPointComponent } from '../user-interface/list-pickupPoint';
import { WrapperPickupPointComponent } from '../user-interface/wrapper-pickupPoint';

@NgModule({
    declarations: [
        WrapperPickupPointComponent,
        ListPickupPointComponent,
        FormPickupPointComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        MaterialModule
    ]
})

export class PickupPointModule { }
