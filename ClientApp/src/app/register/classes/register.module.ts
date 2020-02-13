import { NgModule } from "@angular/core";
import { MaterialModule } from '../../shared/modules/material.module';
import { SharedModule } from '../../shared/modules/shared.module';
import { RegisterComponent } from "../user-interface/form-register";

@NgModule({
    declarations: [
        RegisterComponent
    ],
    imports: [
        SharedModule,
        MaterialModule
    ]
})

export class RegisterModule { }
