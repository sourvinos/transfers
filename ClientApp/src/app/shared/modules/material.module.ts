import { NgModule } from '@angular/core'
import {
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MAT_LABEL_GLOBAL_OPTIONS, MAT_SNACK_BAR_DEFAULT_OPTIONS
} from '@angular/material'

@NgModule({
    exports: [
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatSnackBarModule,
    ],
    providers: [
        { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'always' } },
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } }
    ]
})

export class MaterialModule { }
