import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Driver } from 'src/app/drivers/classes/model-driver';

@Component({
    selector: 'dialog-assign-driver',
    templateUrl: './dialog-assign-driver.html',
    styleUrls: ['../../shared/styles/dialogs.css', './dialog-assign-driver.css']
})

export class DialogAssignDriverComponent {

    id: string = ''
    driverDescription = new FormControl()
    drivers: Driver[] = []
    filteredDrivers: Observable<Driver[]>

    constructor(private dialogRef: MatDialogRef<DialogAssignDriverComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.populateDropDowns()
        this.trackChangesInAutoComplete()
    }

    close() {
        this.dialogRef.close()
    }

    /**
     * Caller(s):
     *  Template - Autocomplete
     * 
     * Description:
     *  Updates the id of the driver
     * 
     * @param event 
     */
    onSelectionChanged(event: { option: { id: string; }; }) {
        this.id = event.option.id
    }

    /**
     * Caller(s):
     *  Class - trackChangesInAutoComplete
     * 
     * Description:
     *  Filters the array according to the given characters
     * 
     * @param description 
     */
    private filter(description: string): Driver[] {
        const filterValue = description.toLowerCase()
        return this.drivers.filter(option => option.description.toLowerCase().indexOf(filterValue) === 0)
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
     * 
     * Description:
     *  Self-explanatory
     */
    private populateDropDowns() {
        this.data.drivers.subscribe((result: any) => {
            this.drivers = result
        })
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
     * 
     * Description:
     *  Keeps track of what is given in the dropdown and filters the array
     */
    private trackChangesInAutoComplete() {
        this.filteredDrivers = this.driverDescription.valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.abbreviation),
                map(input => input ? this.filter(input) : this.drivers.slice())
            )
    }

}
