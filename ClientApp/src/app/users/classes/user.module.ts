import { NgModule } from "@angular/core";
import { MaterialModule } from '../../shared/modules/material.module';
import { SharedModule } from '../../shared/modules/shared.module';
import { UserListComponent } from "../user-interface/user-list";
import { UserFormComponent } from './../user-interface/user-form';

@NgModule({
    declarations: [
        UserListComponent,
        UserFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule
    ]
})

export class UserModule { }
