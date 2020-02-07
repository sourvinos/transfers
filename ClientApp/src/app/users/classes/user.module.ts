import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { FormUserComponent } from '../user-interface/form-user';
import { ListUserComponent } from '../user-interface/list-user';

@NgModule({
    declarations: [
        ListUserComponent,
        FormUserComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        MaterialModule
    ]
})

export class UserModule { }
