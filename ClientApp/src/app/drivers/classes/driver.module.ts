import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { MaterialModule } from '../../shared/modules/material.module';
import { DriverFormComponent } from '../user-interface/form-driver';
import { DriverListComponent } from '../user-interface/list-driver';
import { DriverRoutingModule } from './driver-routing.module';

@NgModule({
    declarations: [
        DriverListComponent,
        DriverFormComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        MaterialModule,
        DriverRoutingModule
    ]
})

export class DriverModule { }
