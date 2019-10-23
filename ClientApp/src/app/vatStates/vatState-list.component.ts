import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { IVatState } from '../models/vatState'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'
import { VatStateService } from '../services/vatState.service'
import { Utils } from '../shared/classes/utils'

@Component({
    selector: 'vatState-list',
    templateUrl: './vatState-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class VatStateListComponent implements OnInit, OnDestroy {

    //#region Init

    vatStates: IVatState[]
    filteredVatStates: IVatState[]

    unlisten: Unlisten

    // #endregion

    constructor(private service: VatStateService, private keyboardShortcutsService: KeyboardShortcuts, private router: Router) {
        this.unlisten = null
    }

    ngOnInit() {
        this.getAllVatStates()
        this.addShortcuts()
        this.setFocus('searchField')
    }

    ngOnDestroy(): void {
        (this.unlisten) && this.unlisten()
    }

    // T
    filter(query: string) {
        this.filteredVatStates = query ? this.vatStates.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.vatStates
    }

    // T
    newRecord() {
        this.router.navigate(['/vatStates/new'])
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

    private getAllVatStates() {
        this.service.getVatStates().subscribe(data => this.filteredVatStates = this.vatStates = data, error => Utils.errorLogger(error))
    }

    private setFocus(element: string) {
        Utils.setFocus(element)
    }

}
