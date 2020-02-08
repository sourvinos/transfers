import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { MaterialModule } from '../../shared/modules/material.module';
import { DestinationFormComponent } from '../user-interface/form-destination';
import { DestinationListComponent } from '../user-interface/list-destination';
import { DestinationRoutingModule } from './destination-routing.module';

@NgModule({
    declarations: [
        DestinationListComponent,
        DestinationFormComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        MaterialModule,
        DestinationRoutingModule
    ]
})

export class DestinationModule { }
