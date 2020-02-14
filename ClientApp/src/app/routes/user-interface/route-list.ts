import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service';
import { Utils } from 'src/app/shared/classes/utils';
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service';
import { Route } from '../classes/route';

@Component({
    selector: 'route-list',
    templateUrl: './route-list.html',
    styleUrls: ['../../shared/styles/lists.css']
})

export class RouteListComponent implements OnInit, OnDestroy {

    // #region Variables

    records: Route[]
    filteredRecords: Route[]

    headers = ['Id', 'Abbreviation', 'Description']
    widths = ['0px', '5%', '50%']
    visibility = ['none', '', '']
    justify = ['center', 'center', 'left']
    fields = ['id', 'abbreviation', 'description']

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    // #endregion

    constructor(private activatedRoute: ActivatedRoute, private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private baseInteractionService: BaseInteractionService) {
        this.loadRecords()
    }

    ngOnInit() {
        this.addShortcuts()
        this.focus('searchField')
        this.subscribeToInteractionService()
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    /**
      * Caller(s):
      *  Class - subscribeTointeractionService()
      *
      * Description:
      *  Self-explanatory
      *
      * @param id
      */
    editRecord(id: number) {
        this.navigateToEditRoute(id)
    }

    /**
     * Caller(s):
     *  Template - searchField
     *
     * Description:
     *  Filters and returns the array to the template according to the input
     *
     * @param query
     */
    filter(query: string) {
        this.filteredRecords = query ? this.records.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.records
    }

    /**
     * Caller(s):
     *  Template - newRecord()
     *
     * Description:
     *  Navigates to the form so that new records can be appended
     */
    newRecord() {
        this.router.navigate(['/routes/new'])
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
            'Escape': (event: KeyboardEvent): void => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.goBack()
                }
            },
            'Alt.F': (event: KeyboardEvent): void => {
                event.preventDefault()
                this.focus('searchField')
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
     *  Class - constructor
     *
     * Description:
     *  Self-explanatory
     */
    private loadRecords() {
        this.records = this.activatedRoute.snapshot.data['routeList']
        this.filteredRecords = this.records
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
     *
     * Description:
     *  Self-explanatory
     *
     * @param element
     */
    private focus(element: string) {
        Utils.setFocus(element)
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
     *
     * Description:
     *  Gets the selected record from the table through the service and executes the editRecord method
     */
    private subscribeToInteractionService() {
        this.baseInteractionService.record.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.editRecord(response['id'])
        })
    }

    /**
     * Caller(s):
     *  Class - editRecord()
     *
     * Description:
     *  Self-explanatory
     *
     * @param id
     */
    private navigateToEditRoute(id: number) {
        this.router.navigate(['/routes', id])
    }

    // createPDF() {
    //     this.portService.createPDF().subscribe((file: HttpResponse<Blob>) => {
    //         window.location.href = file.url
    //     })
    // }

}
