import { NgModule } from "@angular/core";
import { MaterialModule } from '../../shared/modules/material.module';
import { SharedModule } from '../../shared/modules/shared.module';
import { LoginComponent } from "../user-interface/form-login";

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        SharedModule,
        MaterialModule
    ]
})

export class LoginModule { }
