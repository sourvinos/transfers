import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputFormatDirective } from 'src/app/shared/directives/input-format.directive';
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive';
import { DialogAlertComponent } from '../components/dialog-alert/dialog-alert.component';
import { SafeStylePipe } from '../pipes/safeStyle';
import { CustomTableComponent } from './../components/table/custom-table';
import { MaterialModule } from './material.module';
import { DialogIndexComponent } from '../components/dialog-index/dialog-index.component';

@NgModule({
    declarations: [
        InputFormatDirective,
        InputTabStopDirective,
        DialogAlertComponent,
        DialogIndexComponent,
        CustomTableComponent,
        SafeStylePipe,
    ],
    imports: [
        CommonModule,
        MaterialModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        InputFormatDirective,
        InputTabStopDirective,
        ReactiveFormsModule,
        CustomTableComponent,
        RouterModule
    ],
    entryComponents: [
        DialogAlertComponent,
        DialogIndexComponent,
    ]
})

export class SharedModule { }
