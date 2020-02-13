import { NgModule } from "@angular/core";
import { MaterialModule } from '../../shared/modules/material.module';
import { SharedModule } from '../../shared/modules/shared.module';
import { CustomerFormComponent } from './../user-interface/form-customer';
import { CustomerListComponent } from './../user-interface/list-customer';

@NgModule({
    declarations: [
        CustomerListComponent,
        CustomerFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule
    ]
})

export class CustomerModule { }
