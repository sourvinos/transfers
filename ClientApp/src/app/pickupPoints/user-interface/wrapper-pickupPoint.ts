import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DriverService } from 'src/app/services/driver.service';
import { KeyboardShortcuts, Unlisten } from 'src/app/services/keyboard-shortcuts.service';
import { Utils } from 'src/app/shared/classes/utils';
import { InteractionPickupPointService } from '../classes/service-interaction-pickupPoint';
import { IRoute } from './../../models/route';
import { RouteService } from './../../services/route.service';

@Component({
    selector: 'wrapper-pickupPoint',
    templateUrl: './wrapper-pickupPoint.html',
    styleUrls: ['../../shared/styles/lists.css', './wrapper-pickupPoint.css']
})

export class WrapperPickupPointComponent implements OnInit, OnDestroy {

    // #region Variables

    routes: IRoute[] = []
    records: string[] = []

    selectedRouteId: string = ''

    recordStatus: string = 'empty'
    hasTableData: boolean = false

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    // #endregion Variables

    constructor(private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private activatedRoute: ActivatedRoute, private location: Location, private interactionPickupPointService: InteractionPickupPointService, public dialog: MatDialog, private driverService: DriverService, private snackBar: MatSnackBar, private routeService: RouteService) { }

    ngOnInit(): void {
        this.addShortcuts()
        this.subscribeToInderactionService()
        this.populateDropDowns()
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
        this.interactionPickupPointService.performAction('deleteRecord')
    }

    /**
     * Caller(s):
     *  Template - loadTransfers()
     * 
     * Description:
     *  Loads from the api the records for the given date
     */
    loadPickupPoints(): void {
        this.navigateToList()
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
                this.router.navigate([this.location.path() + '/pickupPoint/new'])
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
        console.log('saving')
        this.interactionPickupPointService.performAction('saveRecord')
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
    private focus(field: string): void {
        Utils.setFocus(field)
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
     *  Class - subscribeToInderactionService()
     * 
     * Description:
     *  Gets the record status from the form through the interaction service
     *  The variable 'recordStatus' will be checked by the template which decides which buttons to display
     */
    private updateRecordStatus(): void {
        this.interactionPickupPointService.recordStatus.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
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
        this.interactionPickupPointService.hasTableData.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.hasTableData = response
        })
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
     *  Class - assignDriver()
     * 
     * Description:
     *  Self-explanatory
     */
    private navigateToList(): void {
        this.router.navigate(['routeId/', this.selectedRouteId], { relativeTo: this.activatedRoute })
    }

    /**
     * Caller(s):
     *  Class - assignDriver()
     * 
     * Description:
     *  Self-explanatory
     */
    private showSnackbar(message: string, type: string): void {
        this.snackBar.open(message, 'Close', {
            panelClass: [type]
        })
    }

    private populateDropDowns() {
        this.routeService.getRoutes().subscribe((result: any) => {
            this.routes = result
        })
    }


}
