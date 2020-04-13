import { SnackbarComponent } from '../components/snackbar/snackbar.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputFormatDirective } from 'src/app/shared/directives/input-format.directive';
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive';
import { DialogAlertComponent } from '../components/dialog-alert/dialog-alert.component';
import { DialogIndexComponent } from '../components/dialog-index/dialog-index.component';
import { CustomTableComponent } from '../components/table/custom-table';
import { MaterialModule } from './material.module';
import { SafeStylePipe } from '../pipes/safeStyle';

@NgModule({
        declarations: [
                CustomTableComponent,
                DialogAlertComponent,
                SnackbarComponent,
                DialogIndexComponent,
                InputFormatDirective,
                InputTabStopDirective,
                SafeStylePipe
        ],
        imports: [
                CommonModule,
                FormsModule,
                MaterialModule
        ],
        exports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                CustomTableComponent,
                InputFormatDirective,
                InputTabStopDirective,
                RouterModule
        ],
        entryComponents: [
                DialogAlertComponent,
                DialogIndexComponent,
                SnackbarComponent
        ]
})

export class SharedModule { }
