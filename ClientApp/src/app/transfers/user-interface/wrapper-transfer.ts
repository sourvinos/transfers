import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { DriverService } from 'src/app/services/driver.service';
import { KeyboardShortcuts, Unlisten } from 'src/app/services/keyboard-shortcuts.service';
import { Utils } from 'src/app/shared/classes/utils';
import { TransferService } from './../classes/service-api-transfer';
import { InteractionTransferService } from './../classes/service-interaction-transfer';
import { DialogAssignDriverComponent } from './dialog-assign-driver';

@Component({
    selector: 'wrapper-transfer',
    templateUrl: './wrapper-transfer.html',
    styleUrls: ['../../shared/styles/lists.css', './wrapper-transfer.css']
})

export class WrapperTransferComponent implements OnInit, OnDestroy {

    // #region Variables

    dateIn: string = '01/10/2019'
    dateInISO: string = ''
    firstRecord: string = ''
    records: string[] = []

    recordStatus: string = 'empty'

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    // #endregion Variables

    constructor(private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private activatedRoute: ActivatedRoute, private location: Location, private interactionTransferService: InteractionTransferService, private transferService: TransferService, public dialog: MatDialog, private driverService: DriverService) { }

    ngOnInit(): void {
        this.addShortcuts()
        this.subscribeToInderactionService()
        this.focus('dateIn')
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.unsubscribe();
        this.unlisten && this.unlisten()
    }

    /**
     * Caller(s):
     *  Template - deleteRecord()
     * 
     * Description:
     *  Executes the delete method on the form through the interaction service
     */
    deleteRecord() {
        this.interactionTransferService.performAction('deleteRecord')
    }

    /**
     * Caller(s):
     *  Template - loadTransfers()
     * 
     * Description:
     *  Loads from the api the records for the given date
     */
    loadTransfers() {
        if (this.isCorrectDate()) {
            this.updateLocalStorage()
            this.router.navigate(['dateIn/', this.dateInISO], { relativeTo: this.activatedRoute })
        }
    }

    /**
     * Caller(s):
     *  Template - newRecord()
     * 
     * Description:
     *  Navigates to the form so that new records can be appended
     */
    newRecord() {
        this.router.navigate([this.location.path() + '/transfer/new'])
    }

    /**
     * Caller(s):
     *  Template - saveRecord()
     * 
     * Description:
     *  Executes the save method on the form through the interaction service
     */
    saveRecord() {
        this.interactionTransferService.performAction('saveRecord')
    }

    /**
 * Caller(s):
 *  Template - assignDriver()
 * 
 * Description:
 *  Assign a driver to the checked records
 */
    assignDriver() {
        this.records = JSON.parse(localStorage.getItem('selectedIds'))
        const dialogRef = this.dialog.open(DialogAssignDriverComponent, {
            height: '250px',
            width: '550px',
            data: {
                title: 'Select a driver',
                drivers: this.driverService.getDrivers(),
                actions: ['cancel', 'ok']
            },
            panelClass: 'dialog'
        })
        return dialogRef.afterClosed().subscribe(result => {
            if (result != undefined) {
                this.transferService.assignDriver(result, this.records).subscribe(() => {
                    this.router.navigate(['dateIn/', this.dateInISO], { relativeTo: this.activatedRoute })
                })
            }
        })
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
     * 
     * Description:
     *  Adds keyboard functionality
     */
    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            "Escape": (event: KeyboardEvent): void => {
                if (document.getElementsByClassName('cdk-overlay-pane').length == 0) {
                    this.goBack()
                }
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
     *  Class - ngOnInit()
     * 
     * Description:
     *  Calls the public method
     * 
     * @param field 
     * 
     */
    private focus(field: string) {
        Utils.setFocus(field)
    }

    /**
     * Caller(s):
     *  Class - loadTransfers()
     * 
     * Description:
     *  Checks for valid date
     */
    private isCorrectDate() {
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

    private removeAllSummaryItemsFromLocalStorage() {
        localStorage.removeItem('transfers')
    }

    /**
     * Caller(s): 
     *  Class - loadTransfers()
     * 
     * Description:
     *  Stores the given date to the localStorage for reading in later visits
     */
    private updateLocalStorage() {
        localStorage.setItem('date', this.dateInISO)
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
     * 
     * Description:
     *  Gets the record status from the form through the interaction service
     *  The variable 'recordStatus' will be checked by the template which decides which buttons to display
     */
    private subscribeToInderactionService() {
        this.interactionTransferService.recordStatus.subscribe(response => {
            this.recordStatus = response
        })
    }

    /**
     * Caller(s):
     *  Class - addShortcuts()
     * 
     * Description:
     *  On escape navigates to the home route
     */
    private goBack() {
        this.router.navigate(['/'])
    }

}
