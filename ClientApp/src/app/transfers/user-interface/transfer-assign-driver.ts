import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Driver } from 'src/app/drivers/classes/driver';

@Component({
    selector: 'transfer-assign-driver',
    templateUrl: './transfer-assign-driver.html',
    styleUrls: ['../../shared/styles/dialogs.css', './transfer-assign-driver.css']
})

export class TransferAssignDriverComponent implements OnInit {

    id = ''
    drivers: Driver[] = []

    constructor(private dialogRef: MatDialogRef<TransferAssignDriverComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.populateDropDowns()
    }

    onClose() {
        this.dialogRef.close()
    }

    private populateDropDowns() {
        this.data.drivers.subscribe((result: any) => {
            this.drivers = result
        })
    }

}
