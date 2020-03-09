import { NgModule } from '@angular/core'
import { MaterialModule } from '../../shared/modules/material.module'
import { SharedModule } from '../../shared/modules/shared.module'
import { ForgotPasswordFormComponent } from '../user-interface/forgot-password-form'

@NgModule({
    declarations: [
        ForgotPasswordFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule
    ]
})

export class AccountModule { }
