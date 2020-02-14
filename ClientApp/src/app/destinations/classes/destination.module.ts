import { NgModule } from '@angular/core';
import { MaterialModule } from '../../shared/modules/material.module';
import { SharedModule } from '../../shared/modules/shared.module';
import { DestinationFormComponent } from '../user-interface/destination-form';
import { DestinationListComponent } from '../user-interface/destination-list';

@NgModule({
    declarations: [
        DestinationListComponent,
        DestinationFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule
    ]
})

export class DestinationModule { }
