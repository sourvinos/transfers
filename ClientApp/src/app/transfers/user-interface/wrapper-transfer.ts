import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DriverService } from 'src/app/services/driver.service';
import { KeyboardShortcuts, Unlisten } from 'src/app/services/keyboard-shortcuts.service';
import { Utils } from 'src/app/shared/classes/utils';
import { TransferService } from './../classes/service-api-transfer';
import { DialogAssignDriverComponent } from './dialog-assign-driver';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service';

@Component({
    selector: 'wrapper-transfer',
    templateUrl: './wrapper-transfer.html',
    styleUrls: ['../../shared/styles/lists.css', './wrapper-transfer.css']
})

export class WrapperTransferComponent implements OnInit, OnDestroy {

    // #region Init

    dateIn: string = '01/10/2019'
    dateInISO: string = ''
    records: string[] = []

    recordStatus: string = 'empty'
    hasTableData: boolean = false

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    // #endregion Init

    constructor(private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private activatedRoute: ActivatedRoute, private location: Location, private interactionService: BaseInteractionService, private transferService: TransferService, public dialog: MatDialog, private driverService: DriverService, private snackbarService: SnackbarService) { }

    ngOnInit(): void {
        this.addShortcuts()
        this.subscribeToInderactionService()
        this.focus('dateIn')
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.unsubscribe();
        this.unlisten && this.unlisten()
        this.removeSelectedIdsFromLocalStorage()
    }

    /**
     * Caller(s):
     *  Template - deleteRecord()
     * 
     * Description:
     *  Executes the delete method on the form through the interaction service
     */
    deleteRecord(): void {
        this.interactionService.performAction('deleteRecord')
    }

    /**
     * Caller(s):
     *  Template - loadTransfers()
     * 
     * Description:
     *  Loads from the api the records for the given date
     */
    loadTransfers(): void {
        this.clearSelectedArraysFromLocalStorage()
        if (this.isValidDate()) {
            this.updateLocalStorageWithDate()
            this.navigateToList()
        }
    }

    /**
     * Caller(s):
     *  Template - newRecord()
     * 
     * Description:
     *  Check for the default driver and if found, avigates to the form so that new records can be appended
     */
    newRecord(): void {
        this.driverService.getDefaultDriver().then(response => {
            if (response)
                this.router.navigate([this.location.path() + '/transfer/new'])
            else
                this.showSnackbar('No default driver found', 'error')
        })
    }

    /**
     * Caller(s):
     *  Template - saveRecord()
     * 
     * Description:
     *  Executes the save method on the form through the interaction service
     */
    saveRecord(): void {
        this.interactionService.performAction('saveRecord')
    }

    /**
     * Caller(s):
     *  Template - assignDriver()
     * 
     * Description:
     *  Assign a driver to the checked records
     */
    assignDriver(): void {
        if (this.isRecordSelected()) {
            const dialogRef = this.dialog.open(DialogAssignDriverComponent, {
                height: '350px',
                width: '550px',
                data: {
                    title: 'Assign driver',
                    drivers: this.driverService.getDrivers(),
                    actions: ['cancel', 'ok']
                },
                panelClass: 'dialog'
            })
            dialogRef.afterClosed().subscribe(result => {
                if (result != undefined) {
                    this.transferService.assignDriver(result, this.records).subscribe(() => {
                        this.removeSelectedIdsFromLocalStorage()
                        this.navigateToList()
                        this.showSnackbar('All records have been processed', 'info')
                    })
                }
            })
        }
    }

    /**
     * Caller(s):
     *  Template - tableHasData()
     * 
     * Description:
     *  The variable 'hasTableData' will be checked by the template to display or not the 'Assign driver' button
     */
    tableHasData(): boolean {
        return this.hasTableData
    }

    /**
     * Caller(s):
     *  Template - inList()
     * 
     * Description:
     *  Returns true if we are list-transfer route in order to enable the 'new' button
     */
    inList(): boolean {
        return this.router.url.split('/').length == 4
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
     * 
     * Description:
     *  Adds keyboard functionality
     */
    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            "Escape": (event: KeyboardEvent): void => {
                if (document.getElementsByClassName('cdk-overlay-pane').length == 0) {
                    this.goBack()
                }
            },
            "Alt.A": (event: KeyboardEvent): void => {
                event.preventDefault()
                document.getElementById('assignDriver').click()
            },
            "Alt.S": (event: KeyboardEvent): void => {
                event.preventDefault()
                document.getElementById('search').click()
            },
            "Alt.N": (event: KeyboardEvent): void => {
                event.preventDefault()
                document.getElementById('new').click()
            }
        }, {
            priority: 1,
            inputs: true
        })
    }

    /**
     * Caller(s): 
     *  Class - loadTransfers()
     * 
     * Description:
     *  Self-explanatory
     */
    private clearSelectedArraysFromLocalStorage(): void {
        localStorage.removeItem('transfers')
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
     * 
     * Description:
     *  Calls the public method
     * 
     * @param field 
     * 
     */
    private focus(field: string): void {
        Utils.setFocus(field)
    }

    /**
     * Caller(s):
     *  Class - addShortcuts()
     * 
     * Description:
     *  On escape navigates to the home route
     */
    private goBack(): void {
        this.router.navigate(['/'])
    }

    /**
     * Caller(s):
     *  Class - assignDriver()
     * 
     * Description
     *  Checks user input
     */
    private isRecordSelected(): boolean {
        this.records = JSON.parse(localStorage.getItem('selectedIds'))
        if (this.records == null || this.records.length == 0) {
            this.showSnackbar('No records have been selected!', 'error')
            return false
        }
        return true
    }

    /**
     * Caller(s):
     *  Class - loadTransfers()
     * 
     * Description:
     *  Checks for valid date
     */
    private isValidDate(): boolean {
        let date = (<HTMLInputElement>document.getElementById('dateIn')).value
        if (date.length == 10) {
            this.dateInISO = moment(date, 'DD/MM/YYYY').toISOString(true)
            this.dateInISO = moment(this.dateInISO).format('YYYY-MM-DD')
            return true
        }
        else {
            this.dateInISO = ''
            return false
        }
    }

    /**
     * Caller(s):
     *  Class - loadTransfers()
     *  Class - assignDriver()
     * 
     * Description:
     *  Self-explanatory
     */
    private navigateToList(): void {
        this.router.navigate(['dateIn/', this.dateInISO], { relativeTo: this.activatedRoute })
    }

    /**
     * Caller(s):
     *  Class - ngOnDestroy()
     *  Class - assignDriver()
     * 
     * Description:
     *  Self-explanatory
     */
    private removeSelectedIdsFromLocalStorage(): void {
        localStorage.removeItem('selectedIds')
    }

    /**
     * Caller(s):
     *  Class - assignDriver()
     * 
     * Description:
     *  Self-explanatory
     */
    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
     * 
     * Description:
     *  Gets the record status from the form through the interaction service
     *  The variable 'recordStatus' will be checked by the template which decides which buttons to display
     */
    private subscribeToInderactionService(): void {
        this.updateRecordStatus()
        this.updateTableStatus()
    }

    /**
     * Caller(s): 
     *  Class - loadTransfers()
     * 
     * Description:
     *  Stores the given date to the localStorage for reading in later visits
     */
    private updateLocalStorageWithDate(): void {
        localStorage.setItem('date', this.dateInISO)
    }

    /**
     * Caller(s):
     *  Class - subscribeToInderactionService()
     * 
     * Description:
     *  Gets the record status from the form through the interaction service
     *  The variable 'recordStatus' will be checked by the template which decides which buttons to display
     */
    private updateRecordStatus(): void {
        this.interactionService.recordStatus.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.recordStatus = response
        })
    }

    /**
     * Caller(s):
     *  Class - subscribeToInderactionService()
     * 
     * Description:
     *  Gets the table status from the table through the interaction service
     *  The variable 'hasTableData' will be checked by the template to display or not the 'Assign driver' button
     */
    private updateTableStatus(): void {
        this.interactionService.hasTableData.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.hasTableData = response
        })
    }

}
