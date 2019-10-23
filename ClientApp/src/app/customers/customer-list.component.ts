import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ICustomer } from '../models/customer'
import { CustomerService } from '../services/customer.service'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'
import { Utils } from '../shared/classes/utils'

@Component({
    selector: 'app-customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class CustomerListComponent implements OnInit, OnDestroy {

    //#region Init

    customers: ICustomer[]
    filteredCustomers: ICustomer[]

    unlisten: Unlisten

    //#endregion

    constructor(private service: CustomerService, private keyboardShortcutsService: KeyboardShortcuts, private router: Router) {
        this.unlisten = null
    }

    ngOnInit() {
        this.getAllCustomers()
        this.addShortcuts()
        this.setFocus('searchField')
    }

    ngOnDestroy(): void {
        (this.unlisten) && this.unlisten()
    }

    // T
    filter(query: string) {
        this.filteredCustomers = query ? this.customers.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.customers
    }

    // T
    newRecord() {
        this.router.navigate(['/customers/new'])
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

    private getAllCustomers() {
        this.service.getCustomers().subscribe(data => this.filteredCustomers = this.customers = data, error => Utils.errorLogger(error))
    }

    private setFocus(element: string) {
        Utils.setFocus(element)
    }

}
