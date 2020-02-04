import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputFormatDirective } from 'src/app/shared/directives/input-format.directive';
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive';

@NgModule({
    declarations: [
        InputFormatDirective,
        InputTabStopDirective
    ],
    exports: [
        CommonModule,
        FormsModule,
        InputFormatDirective,
        InputTabStopDirective,
        ReactiveFormsModule,
        RouterModule
    ]
})

export class SharedModule { }
