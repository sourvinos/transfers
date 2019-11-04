import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-material-dialog',
    templateUrl: './material-dialog.component.html',
    styleUrls: ['./material-dialog.component.css']
})

export class MaterialDialogComponent {

    constructor(private dialogRef: MatDialogRef<MaterialDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    close() {
        this.dialogRef.close()
    }

}
