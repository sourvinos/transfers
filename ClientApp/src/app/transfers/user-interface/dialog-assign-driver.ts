import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IDriver } from './../../models/driver';

@Component({
    selector: 'dialog-assign-driver',
    templateUrl: './dialog-assign-driver.html',
    styleUrls: ['../../shared/styles/dialogs.css', './dialog-assign-driver.css']
})

export class DialogAssignDriverComponent {

    driverId: number
    drivers: IDriver[] = []

    constructor(private dialogRef: MatDialogRef<DialogAssignDriverComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.data.drivers.subscribe((result: any) => {
            this.drivers = result
        })
    }

    close() {
        this.dialogRef.close()
    }

}
