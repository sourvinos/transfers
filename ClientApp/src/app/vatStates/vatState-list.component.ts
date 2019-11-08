import { SelectionModel } from '@angular/cdk/collections'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatTableDataSource } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
import { IVatState } from '../models/vatState'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'
import { Utils } from '../shared/classes/utils'

@Component({
    selector: 'vatState-list',
    templateUrl: './vatState-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class VatStateListComponent implements OnInit, OnDestroy {

    // #region Init

    vatStates: IVatState[]
    filteredVatStates: IVatState[]

    columns = ['id', 'description']
    fields = ['Id', 'Description']
    format = ['', '']
    align = ['center', 'left']

    unlisten: Unlisten

    dataSource: MatTableDataSource<IVatState>
    selection: SelectionModel<[]>

    selectedElement = []

    // #endregion

    constructor(private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private route: ActivatedRoute) {
        this.vatStates = this.route.snapshot.data['vatStateList']
        this.filteredVatStates = this.vatStates
        this.dataSource = new MatTableDataSource<IVatState>(this.filteredVatStates)
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
    editRecord() {
        this.router.navigate(['/vatStates/', document.querySelector('.mat-row.selected').children[0].textContent])
    }

    // T
    newRecord() {
        this.router.navigate(['/taxStates/new'])
    }

    // T
    filter(query: string) {
        this.dataSource.data = query ? this.vatStates.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.vatStates
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
