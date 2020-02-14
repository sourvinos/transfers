import { NgModule } from '@angular/core';
import { MaterialModule } from '../../shared/modules/material.module';
import { SharedModule } from '../../shared/modules/shared.module';
import { LoginFormComponent } from '../user-interface/login-form';

@NgModule({
    declarations: [
        LoginFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule
    ]
})

export class LoginModule { }
