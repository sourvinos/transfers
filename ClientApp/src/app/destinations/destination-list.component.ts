import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { IDestination } from '../models/destination'
import { DestinationService } from '../services/destination.service'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'
import { Utils } from '../shared/classes/utils'

@Component({
    selector: 'destination-list',
    templateUrl: './destination-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class DestinationListComponent implements OnInit, OnDestroy {

    // #region Init

    destinations: IDestination[]
    filteredDestinations: IDestination[]

    unlisten: Unlisten

    // #endregion

    constructor(private service: DestinationService, private keyboardShortcutsService: KeyboardShortcuts, private router: Router) {
        this.unlisten = null
    }

    ngOnInit() {
        this.getAllDestinations()
        this.addShortcuts()
        this.setFocus('searchField')
    }

    ngOnDestroy(): void {
        (this.unlisten) && this.unlisten();
    }

    // T
    filter(query: string) {
        this.filteredDestinations = query ? this.destinations.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.destinations
    }

    // T
    newRecord() {
        this.router.navigate(['/destinations/new'])
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            "Alt.N": (event: KeyboardEvent): void => {
                event.preventDefault()
                document.getElementById('new').click()
            }
        }, {
            priority: 1,
            inputs: true
        })
    }

    private getAllDestinations() {
        this.service.getDestinations().subscribe(data => { this.filteredDestinations = this.destinations = data }, error => Utils.errorLogger(error))
    }

    private setFocus(element: string) {
        Utils.setFocus(element)
    }

}
