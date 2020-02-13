import { NgModule } from "@angular/core";
import { MaterialModule } from '../../shared/modules/material.module';
import { SharedModule } from '../../shared/modules/shared.module';
import { RouteFormComponent } from "../user-interface/form-route";
import { RouteListComponent } from "../user-interface/list-route";

@NgModule({
    declarations: [
        RouteListComponent,
        RouteFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule
    ]
})

export class RouteModule { }
