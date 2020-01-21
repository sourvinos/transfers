import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'dialog-alert',
    templateUrl: './dialog-alert.component.html',
    styleUrls: ['../../styles/dialogs.css']
})

export class DialogAlertComponent {

    public titleColor = ''

    constructor(private dialogRef: MatDialogRef<DialogAlertComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.titleColor = data.titleColor
    }

    close() {
        this.dialogRef.close()
    }

}
