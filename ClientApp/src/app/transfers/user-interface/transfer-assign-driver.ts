import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Driver } from 'src/app/drivers/classes/driver';

@Component({
    selector: 'transfer-assign-driver',
    templateUrl: './transfer-assign-driver.html',
    styleUrls: ['../../shared/styles/dialogs.css', './transfer-assign-driver.css']
})

export class TransferAssignDriverComponent implements OnInit {

    //#region Private
    drivers: Driver[] = []
    //#endregion

    //#region Form
    id = ''
    //#endregion

    constructor(private dialogRef: MatDialogRef<TransferAssignDriverComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.populateDropDowns()
    }

    public onClose() {
        this.dialogRef.close()
    }

    private populateDropDowns() {
        this.data.drivers.subscribe((result: any) => {
            this.drivers = result.sort((a: { description: number; }, b: { description: number; }) => (a.description > b.description) ? 1 : -1)
        })
    }

}
