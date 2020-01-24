import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { KeyboardShortcuts, Unlisten } from 'src/app/services/keyboard-shortcuts.service';
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service';
import { FormControl } from '@angular/forms';
import { Utils } from 'src/app/shared/classes/utils';
import { RouteService } from 'src/app/routes/classes/service-api-route';
import { Route } from 'src/app/routes/classes/model-route';

@Component({
    selector: 'wrapper-pickupPoint',
    templateUrl: './wrapper-pickupPoint.html',
    styleUrls: ['../../shared/styles/lists.css', './wrapper-pickupPoint.css']
})

export class WrapperPickupPointComponent implements OnInit, OnDestroy {

    // #region Init

    id: string = ''
    routeDescription = new FormControl()
    routes: Route[] = []
    filteredRoutes: Observable<Route[]>

    recordStatus: string = 'empty'

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    // #endregion

    constructor(private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private activatedRoute: ActivatedRoute, private location: Location, private interactionPickupPointService: BaseInteractionService, public dialog: MatDialog, private routeService: RouteService) { }

    ngOnInit(): void {
        this.addShortcuts()
        this.subscribeTointeractionService()
        this.populateDropDowns()
        this.trackChangesInAutoComplete()
        this.focus('routeDescription')
    }

    ngOnDestroy(): void {
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
    deleteRecord(): void {
        this.interactionPickupPointService.performAction('deleteRecord')
    }

    /**
     * Caller(s):
     *  Template - loadPickupPoints()
     * 
     * Description:
     *  Loads from the api the records for the given route
     */
    loadPickupPoints(): void {
        this.navigateToList()
    }

    /**
     * Caller(s):
     *  Template - newRecord()
     * 
     * Description:
     *  Navigates to the form so that new records can be appended
     */
    newRecord(): void {
        this.router.navigate([this.location.path() + '/pickupPoint/new'])
    }

    /**
     * Caller(s):
     *  Template - Autocomplete
     * 
     * Description:
     *  Updates the id which is used to find the relative pickup points
     * 
     * @param event 
     */
    onSelectionChanged(event: { option: { id: string; }; }) {
        this.id = event.option.id
    }

    /**
     * Caller(s):
     *  Template - saveRecord()
     * 
     * Description:
     *  Executes the save method on the form through the interaction service
     */
    saveRecord(): void {
        this.interactionPickupPointService.performAction('saveRecord')
    }

    /**
     * Caller(s):
     *  Template - inList()
     * 
     * Description:
     *  Returns true if we are list route in order to enable the 'new' button
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
     *  Class - trackChangesInAutoComplete
     * 
     * Description:
     *  Filters the array according to the given characters
     * 
     * @param abbreviation
     */
    private filter(abbreviation: string) {
        const filterValue = abbreviation.toLowerCase()
        return this.routes.filter(o => o.abbreviation.toLowerCase().indexOf(filterValue) === 0)
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
     *  Class - loadPickupPoints()
     * 
     * Description:
     *  Self-explanatory
     */
    private navigateToList(): void {
        this.router.navigate(['routeId/', this.id], { relativeTo: this.activatedRoute })
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
     * 
     * Description:
     *  Self-explanatory
     */
    private populateDropDowns() {
        this.routeService.getAll().subscribe((result: any) => {
            this.routes = result
        })
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
     * 
     * Description:
     *  Gets the record status from the form through the interaction service
         */
    private subscribeTointeractionService(): void {
        this.updateRecordStatus()
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
     * 
     * Description:
     *  Keeps track of what is given in the dropdown and filters the array
     */
    private trackChangesInAutoComplete() {
        this.filteredRoutes = this.routeDescription.valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.abbreviation),
                map(input => input ? this.filter(input) : this.routes.slice())
            )
    }

    /**
     * Caller(s):
     *  Class - subscribeTointeractionService()
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

}
