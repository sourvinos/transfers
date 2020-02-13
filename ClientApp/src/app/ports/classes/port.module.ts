import { NgModule } from "@angular/core";
import { MaterialModule } from '../../shared/modules/material.module';
import { SharedModule } from '../../shared/modules/shared.module';
import { PortFormComponent } from "../user-interface/form-port";
import { PortListComponent } from "../user-interface/list-port";

@NgModule({
    declarations: [
        PortListComponent,
        PortFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule
    ]
})

export class PortModule { }
