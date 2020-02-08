import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { MaterialModule } from '../../shared/modules/material.module';
import { RouteFormComponent } from '../user-interface/form-route';
import { RouteListComponent } from '../user-interface/list-route';
import { RouteRoutingModule } from './route-routing.module';

@NgModule({
    declarations: [
        RouteListComponent,
        RouteFormComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        MaterialModule,
        RouteRoutingModule
    ]
})

export class RouteModule { }
