import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DriverService } from 'src/app/drivers/classes/driver.service';
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Utils } from 'src/app/shared/classes/utils';
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service';
import { TransferFlat } from 'src/app/transfers/classes/transferFlat';
import { TransferService } from '../classes/transfer.service';
import { TransferPdfService } from '../classes/transfer-pdf.service';
import { TransferAssignDriverComponent } from './transfer-assign-driver';

@Component({
    selector: 'transfer-wrapper',
    templateUrl: './transfer-wrapper.html',
    styleUrls: ['./transfer-wrapper.css']
})

export class TransferWrapperComponent implements OnInit, OnDestroy {

    dateIn = '01/10/2019'
    dateInISO = ''
    records: string[] = []
    drivers: string[] = []
    transfersFlat: TransferFlat[] = []

    recordStatus = 'empty'
    hasTableData = false

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    constructor(private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private activatedRoute: ActivatedRoute, private location: Location, private interactionService: BaseInteractionService, private transferService: TransferService, public dialog: MatDialog, private driverService: DriverService, private snackbarService: SnackbarService, private pdfService: TransferPdfService) { }

    ngOnInit(): void {
        this.addShortcuts()
        this.subscribeToInteractionService()
        this.focus('dateIn')
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
        this.removeSelectedIdsFromLocalStorage()
    }

    /**
     * Caller(s):
     *  Template - assignDriver()
     *
     * Description:
     *  Assign a driver to the checked records
     */

    /**
     * Caller(s):
     *  Template - createPdf()
     *
     * Description:
     *  Sends the records to the service
     */

    /**
     * Caller(s):
     *  Template - onDeleteRecord()
     *
     * Description:
     *  Executes the delete method on the form through the interaction service
     */
    onDeleteRecord(): void {
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
     *  Template - onNewRecord()
     *
     * Description:
     *  Check for the default driver and if found, avigates to the form so that new records can be appended
     */
    onNewRecord() {
        this.driverService.getDefaultDriver().then(response => {
            if (response) {
                this.router.navigate([this.location.path() + '/transfer/new'])
            } else {
                this.showSnackbar('No default driver found', 'error')
            }
        })
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
        return this.router.url.split('/').length === 4
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
            'Escape': (event: KeyboardEvent): void => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.onGoBack()
                }
            },
            'Alt.A': (event: KeyboardEvent): void => {
                event.preventDefault()
                document.getElementById('assignDriver').click()
            },
            'Alt.S': (event: KeyboardEvent): void => {
                event.preventDefault()
                document.getElementById('search').click()
            },
            'Alt.N': (event: KeyboardEvent): void => {
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
    private onGoBack(): void {
        this.router.navigate(['/'])
    }

    /**
     * Caller(s):
     *  Class - assignDriver()
     *
     * Description
     *  Checks user input
     */

    /**
     * Caller(s):
     *  Class - loadTransfers()
     *
     * Description:
     *  Checks for valid date
     */
    private isValidDate(): boolean {
        const date = (<HTMLInputElement>document.getElementById('dateIn')).value
        if (date.length === 10) {
            this.dateInISO = moment(date, 'DD/MM/YYYY').toISOString(true)
            this.dateInISO = moment(this.dateInISO).format('YYYY-MM-DD')
            return true
        } else {
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
    private subscribeToInteractionService(): void {
        this.updateTableStatus()
        this.interactionService.transfers.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.transfersFlat = response
        })
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
     *  Class - subscribeToInteractionService()
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
