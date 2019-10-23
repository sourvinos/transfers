import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'
import { TaxOfficeService } from '../services/taxOffice.service'
import { Utils } from '../shared/classes/utils'
import { ITaxOffice } from './../models/taxOffice'

@Component({
    selector: 'taxOffice-list',
    templateUrl: './taxOffice-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class TaxOfficeListComponent implements OnInit, OnDestroy {

    //#region Init

    taxOffices: ITaxOffice[]
    filteredTaxOffices: ITaxOffice[]

    unlisten: Unlisten

    //#endregion

    constructor(private service: TaxOfficeService, private keyboardShortcutsService: KeyboardShortcuts, private router: Router) {
        this.unlisten = null
    }

    ngOnInit() {
        this.getAllTaxOffices()
        this.addShortcuts()
        this.setFocus('searchField')
    }

    ngOnDestroy(): void {
        (this.unlisten) && this.unlisten();
    }

    // T
    filter(query: string) {
        this.filteredTaxOffices = query ? this.taxOffices.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.taxOffices
    }

    // T
    newRecord() {
        this.router.navigate(['/taxOffices/new'])
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

    private getAllTaxOffices() {
        this.service.getTaxOffices().subscribe(data => this.filteredTaxOffices = this.taxOffices = data, error => Utils.errorLogger(error))
    }

    private setFocus(element: string) {
        Utils.setFocus(element)
    }

}
