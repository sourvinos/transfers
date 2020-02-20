import { NgModule } from '@angular/core';
import { MaterialModule } from '../../shared/modules/material.module';
import { SharedModule } from '../../shared/modules/shared.module';
import { UserListComponent } from '../user-interface/user-list';
import { RegisterFormComponent } from '../user-interface/register-form';

@NgModule({
    declarations: [
        UserListComponent,
        RegisterFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule
    ]
})

export class UserModule { }
