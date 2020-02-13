import { NgModule } from "@angular/core";
import { MaterialModule } from '../../shared/modules/material.module';
import { SharedModule } from '../../shared/modules/shared.module';
import { RegisterFormComponent } from "../user-interface/register-form";

@NgModule({
    declarations: [
        RegisterFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule
    ]
})

export class RegisterModule { }
