import { NgModule } from '@angular/core';
import { MaterialModule } from '../../shared/modules/material.module';
import { SharedModule } from '../../shared/modules/shared.module';
import { ForgotPasswordFormComponent } from '../user-interface/forgot-password-form';
import { ResetPasswordFormComponent } from '../user-interface/reset-password-form';

@NgModule({
    declarations: [
        ForgotPasswordFormComponent,
        ResetPasswordFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule
    ]
})

export class AccountModule { }
