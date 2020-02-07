import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { MaterialModule } from '../../shared/modules/material.module';
import { DestinationFormComponent } from './form-destination';
import { DestinationListComponent } from './list-destination';

@NgModule({
    declarations: [
        DestinationListComponent,
        DestinationFormComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        MaterialModule
    ]
})

export class DestinationModule { }
