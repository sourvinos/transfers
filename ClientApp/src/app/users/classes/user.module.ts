import { NgModule } from '@angular/core';
import { MaterialModule } from '../../shared/modules/material.module';
import { SharedModule } from '../../shared/modules/shared.module';
import { UserListComponent } from '../user-interface/user-list';
import { RegisterUserFormComponent } from '../user-interface/register-user-form';

@NgModule({
    declarations: [
        UserListComponent,
        RegisterUserFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule
    ]
})

export class UserModule { }
