import { SelectionModel } from '@angular/cdk/collections'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatTableDataSource } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
import { IDestination } from '../models/destination'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'
import { Utils } from '../shared/classes/utils'

@Component({
    selector: 'app-destination-list',
    templateUrl: './destination-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class DestinationListComponent implements OnInit, OnDestroy {

    // #region Init

    destinations: IDestination[]
    filteredDestinations: IDestination[]

    columns = ['id', 'abbreviation', 'description']
    fields = ['Id', 'Abbreviation', 'Description']
    format = ['', '', '']
    align = ['center', 'center', 'left']

    unlisten: Unlisten

    dataSource: MatTableDataSource<IDestination>
    selection: SelectionModel<[]>

    selectedElement = []

    // #endregion

    constructor(private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private route: ActivatedRoute) {
        this.destinations = this.route.snapshot.data['destinationList']
        this.filteredDestinations = this.destinations
        this.dataSource = new MatTableDataSource<IDestination>(this.filteredDestinations)
        this.selection = new SelectionModel<[]>(false)
        this.unlisten = null
    }

    ngOnInit() {
        this.addShortcuts()
        this.setFocus('searchField')
    }

    ngOnDestroy(): void {
        (this.unlisten) && this.unlisten()
    }

    // T
    filter(query: string) {
        this.dataSource.data = query ? this.destinations.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.destinations
    }

    // T
    newRecord() {
        this.router.navigate(['/destinations/new'])
    }

    // T
    editRecord() {
        this.router.navigate(['/destinations/', document.querySelector('.mat-row.selected').children[0].textContent])
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            "Enter": (event: KeyboardEvent): void => {
                this.editRecord()
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

}
