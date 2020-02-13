import { NgModule } from "@angular/core";
import { MaterialModule } from '../../shared/modules/material.module';
import { SharedModule } from '../../shared/modules/shared.module';
import { DestinationFormComponent } from "../user-interface/form-destination";
import { DestinationListComponent } from "../user-interface/list-destination";

@NgModule({
    declarations: [
        DestinationListComponent,
        DestinationFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule
    ]
})

export class DestinationModule { }
