import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { MaterialModule } from '../../shared/modules/material.module';
import { RouteFormComponent } from '../user-interface/form-route';
import { RouteListComponent } from '../user-interface/list-route';

@NgModule({
    declarations: [
        RouteListComponent,
        RouteFormComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        MaterialModule
    ]
})

export class RouteModule { }
