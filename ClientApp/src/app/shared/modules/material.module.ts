import { NgModule } from '@angular/core'
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSnackBarModule, MatAutocompleteModule, MatDividerModule, MAT_LABEL_GLOBAL_OPTIONS, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material'

@NgModule({
    exports: [
        MatAutocompleteModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSnackBarModule
    ],
    providers: [
        { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'always' } },
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3500 } }
    ]
})

export class MaterialModule { }
