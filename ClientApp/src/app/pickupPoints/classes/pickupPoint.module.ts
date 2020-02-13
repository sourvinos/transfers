import { NgModule } from "@angular/core";
import { FormPickupPointComponent } from '../user-interface/form-pickupPoint';
import { ListPickupPointComponent } from '../user-interface/list-pickupPoint';
import { WrapperPickupPointComponent } from '../user-interface/wrapper-pickupPoint';
import { MaterialModule } from './../../shared/modules/material.module';
import { SharedModule } from './../../shared/modules/shared.module';

@NgModule({
    declarations: [
        WrapperPickupPointComponent,
        ListPickupPointComponent,
        FormPickupPointComponent,
    ],
    imports: [
        SharedModule,
        MaterialModule
    ]
})

export class PickupPointModule { }
