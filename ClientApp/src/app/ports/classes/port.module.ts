import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { MaterialModule } from '../../shared/modules/material.module';
import { PortFormComponent } from '../user-interface/form-port';
import { PortListComponent } from '../user-interface/list-port';
import { PortRoutingModule } from './port-routing.module';

@NgModule({
    declarations: [
        PortListComponent,
        PortFormComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        MaterialModule,
        PortRoutingModule
    ]
})

export class PortModule { }
