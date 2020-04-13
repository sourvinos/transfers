import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-snackbar',
    templateUrl: './snackbar.component.html',
    styleUrls: ['../../styles/snackbar.css']
})

export class SnackbarComponent {

    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, public snackBar: MatSnackBar) { }

}
