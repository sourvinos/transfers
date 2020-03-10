import { NgModule } from '@angular/core'
import { MaterialModule } from '../../shared/modules/material.module'
import { SharedModule } from '../../shared/modules/shared.module'
import { ResetPasswordFormComponent } from '../user-interface/reset-password-form'

@NgModule({
    declarations: [
        ResetPasswordFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule
    ]
})

export class AccountModule { }
