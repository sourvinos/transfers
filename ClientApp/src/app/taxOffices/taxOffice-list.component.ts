import { SelectionModel } from '@angular/cdk/collections'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatTableDataSource } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
import { ITaxOffice } from '../models/taxOffice'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'
import { Utils } from '../shared/classes/utils'

@Component({
    selector: 'taxOffice-list',
    templateUrl: './taxOffice-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class TaxOfficeListComponent implements OnInit, OnDestroy {

    // #region Init

    taxOffices: ITaxOffice[]
    filteredTaxOffices: ITaxOffice[]

    columns = ['id', 'description']
    fields = ['Id', 'Description']
    format = ['', '']
    align = ['center', 'left']

    unlisten: Unlisten

    dataSource: MatTableDataSource<ITaxOffice>
    selection: SelectionModel<[]>

    selectedElement = []

    // #endregion

    constructor(private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private route: ActivatedRoute) {
        this.taxOffices = this.route.snapshot.data['taxOfficeList']
        this.filteredTaxOffices = this.taxOffices
        this.dataSource = new MatTableDataSource<ITaxOffice>(this.filteredTaxOffices)
        this.selection = new SelectionModel<[]>(false)
        this.unlisten = null
    }

    ngOnInit() {
        this.addShortcuts()
        this.setFocus('searchField')
    }

    ngOnDestroy(): void {
        (this.unlisten) && this.unlisten();
    }

    // T
    editRecord() {
        this.router.navigate(['/taxOffices/', document.querySelector('.mat-row.selected').children[0].textContent])
    }

    // T
    newRecord() {
        this.router.navigate(['/taxOffices/new'])
    }

    // T
    filter(query: string) {
        this.dataSource.data = query ? this.taxOffices.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.taxOffices
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
