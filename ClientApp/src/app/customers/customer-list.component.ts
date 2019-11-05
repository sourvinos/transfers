import { SelectionModel } from '@angular/cdk/collections'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatTableDataSource } from '@angular/material'
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

    columns = ['id', 'description', 'address', 'phones', 'email']
    fields = ['Id', 'Description', 'Address', 'Phones', 'Email']
    format = ['', '', '', '', '']
    align = ['center', 'left', 'left', 'left', 'left']

    unlisten: Unlisten

    dataSource: MatTableDataSource<ICustomer>;
    selection: SelectionModel<[]>;

    selectedElement = []

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
    editRecord() {
        this.router.navigate(['/customers/', document.querySelector('.mat-row.selected').children[0].textContent])
    }

    // T
    newRecord() {
        this.router.navigate(['/customers/new'])
    }

    // T
    filter(query: string) {
        this.dataSource.data = query ? this.customers.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.customers
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

    private getAllCustomers() {
        this.service.getCustomers().subscribe(data => { this.filteredCustomers = this.customers = data; this.dataSource = new MatTableDataSource<ICustomer>(this.filteredCustomers); }, error => Utils.errorLogger(error))
        this.selection = new SelectionModel<[]>(false);
    }

    private setFocus(element: string) {
        Utils.setFocus(element)
    }

}
