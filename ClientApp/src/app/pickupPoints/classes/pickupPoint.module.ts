import { NgModule } from '@angular/core';
import { PickupPointFormComponent } from '../user-interface/pickupPoint-form';
import { PickupPointListComponent } from '../user-interface/pickupPoint-list';
import { PickupPointWrapperComponent } from '../user-interface/pickupPoint-wrapper';
import { MaterialModule } from './../../shared/modules/material.module';
import { SharedModule } from './../../shared/modules/shared.module';

@NgModule({
    declarations: [
        PickupPointWrapperComponent,
        PickupPointListComponent,
        PickupPointFormComponent,
    ],
    imports: [
        SharedModule,
        MaterialModule
    ]
})

export class PickupPointModule { }
