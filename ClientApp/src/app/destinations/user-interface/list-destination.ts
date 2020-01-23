import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { KeyboardShortcuts, Unlisten } from 'src/app/services/keyboard-shortcuts.service'
import { Utils } from 'src/app/shared/classes/utils'
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service'
import { IDestination } from '../classes/model-destination'

@Component({
    selector: 'list-destination',
    templateUrl: './list-destination.html',
    styleUrls: ['../../shared/styles/lists.css', '../../shared/styles/scrollable.css']
})

export class DestinationListComponent implements OnInit, OnDestroy {

    // #region Init

    destinations: IDestination[]
    filteredDestinations: IDestination[]

    headers = ['Id', 'Abbreviation', 'Description']
    widths = ['0px', '5%', '50%']
    visibility = ['none', '', '', '']
    justify = ['center', 'center', 'left']
    fields = ['id', 'abbreviation', 'description']

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    // #endregion Init

    constructor(private activatedRoute: ActivatedRoute, private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private route: ActivatedRoute, private baseInteractionService: BaseInteractionService) {
        this.loadDestinations()
    }

    ngOnInit() {
        this.addShortcuts()
        this.subscribeToInteractionService()
        this.focus('searchField')
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.unsubscribe();
        this.unlisten && this.unlisten()
    }

    // T
    filter(query: string) {
        this.filteredDestinations = query ? this.destinations.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.destinations
    }

    // T
    newRecord() {
        this.router.navigate(['/destinations/new'])
    }

    // T
    editRecord(id: number) {
        this.navigateToEditRoute(id)
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            "Alt.F": (event: KeyboardEvent): void => {
                event.preventDefault()
                this.setFocus('searchField')
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

    private setFocus(element: string) {
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

    private navigateToEditRoute(id: number) {
        this.router.navigate(['destinations/', id])
    }

    private loadDestinations() {
        this.destinations = this.activatedRoute.snapshot.data['destinationList']
        this.filteredDestinations = this.destinations
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

}
