import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'dialog-alert',
    templateUrl: './dialog-alert.component.html',
    styleUrls: ['./dialog-alert.component.css']
})

export class DialogAlertComponent {

    constructor(private dialogRef: MatDialogRef<DialogAlertComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    close() {
        this.dialogRef.close()
    }

}
