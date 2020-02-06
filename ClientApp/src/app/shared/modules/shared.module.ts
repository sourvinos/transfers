import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputFormatDirective } from 'src/app/shared/directives/input-format.directive';
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive';
import { DialogIndexComponent } from '../components/dialog-index/dialog-index.component';
import { DialogAlertComponent } from '../components/dialog-alert/dialog-alert.component';
import { MaterialModule } from './material.module';
import { SafeStylePipe } from '../pipes/safeStyle';

@NgModule({
    declarations: [
        InputFormatDirective,
        InputTabStopDirective,
        DialogAlertComponent,
        SafeStylePipe,
    ],
    imports: [
        MaterialModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        InputFormatDirective,
        InputTabStopDirective,
        ReactiveFormsModule,
        RouterModule
    ],
    entryComponents: [
        DialogAlertComponent,
    ]
})

export class SharedModule { }
