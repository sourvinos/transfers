import { NgModule } from '@angular/core'
import { MaterialModule } from '../../shared/modules/material.module'
import { SharedModule } from '../../shared/modules/shared.module'
import { CustomerFormComponent } from '../user-interface/customer-form'
import { CustomerListComponent } from '../user-interface/customer-list'

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
