import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { CustomerFormComponent } from '../user-interface/form-customer';
import { CustomerListComponent } from '../user-interface/list-customer';
import { MaterialModule } from './../../shared/modules/material.module';

@NgModule({
    declarations: [
        CustomerListComponent,
        CustomerFormComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        MaterialModule
    ]
})

export class CustomerModule { }
