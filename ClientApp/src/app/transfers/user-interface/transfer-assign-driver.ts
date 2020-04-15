import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Driver } from 'src/app/drivers/classes/driver';

@Component({
    selector: 'transfer-assign-driver',
    templateUrl: './transfer-assign-driver.html',
    styleUrls: ['../../shared/styles/dialogs.css', './transfer-assign-driver.css']
})

export class TransferAssignDriverComponent implements OnInit {

    id = ''
    driverDescription = new FormControl()
    drivers: Driver[] = []
    filteredDrivers: Observable<Driver[]>

    constructor(private dialogRef: MatDialogRef<TransferAssignDriverComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.populateDropDowns()
        this.trackChangesInAutoComplete()
    }

    close() {
        this.dialogRef.close()
    }

    onSelectionChanged(event: { option: { id: string; }; }) {
        this.id = event.option.id
    }

    private filter(description: string): Driver[] {
        const filterValue = description.toLowerCase()
        return this.drivers.filter(option => option.description.toLowerCase().indexOf(filterValue) === 0)
    }

    private populateDropDowns() {
        this.data.drivers.subscribe((result: any) => {
            this.drivers = result
        })
    }

    private trackChangesInAutoComplete() {
        this.filteredDrivers = this.driverDescription.valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.abbreviation),
                map(input => input ? this.filter(input) : this.drivers.slice())
            )
    }

}
