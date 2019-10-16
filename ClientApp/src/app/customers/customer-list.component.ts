import { Component, OnInit } from '@angular/core'

import { CustomerService } from '../services/customer.service'
import { ICustomer } from '../models/customer'
import { Utils } from '../shared/classes/utils'

@Component({
    selector: 'app-customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class CustomerListComponent implements OnInit {

    customers: ICustomer[]
    filteredCustomers: ICustomer[]

    constructor(private service: CustomerService) { }

    ngOnInit() {
        this.getAllCustomers()
    }

    filter(query: string) {
        this.filteredCustomers = query ? this.customers.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.customers
    }

    private getAllCustomers() {
        this.service.getCustomers().subscribe(data => this.filteredCustomers = this.customers = data, error => Utils.errorLogger(error))
    }

    private isRefreshNeeded() {
        this.service.refreshNeeded.subscribe(() => { this.getAllCustomers() })
    }

}
