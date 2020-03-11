import { NgModule } from '@angular/core';
import { MaterialModule } from '../../shared/modules/material.module';
import { SharedModule } from '../../shared/modules/shared.module';
import { ForgotPasswordFormComponent } from '../user-interface/forgot-password-form';
import { EmailConfirmedComponent } from './../user-interface/email-confirmed';

@NgModule({
    declarations: [
        ForgotPasswordFormComponent,
        EmailConfirmedComponent
    ],
    imports: [
        SharedModule,
        MaterialModule
    ]
})

export class AccountModule { }
