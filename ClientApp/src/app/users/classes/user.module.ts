import { NgModule } from "@angular/core";
import { MaterialModule } from '../../shared/modules/material.module';
import { SharedModule } from '../../shared/modules/shared.module';
import { UserFormComponent } from "../user-interface/form-user";
import { UserListComponent } from "../user-interface/list-user";

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
