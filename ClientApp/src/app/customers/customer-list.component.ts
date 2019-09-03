// Base
import { Component, OnInit } from '@angular/core';
import { get } from 'scriptjs';
// Custom
import { ICustomer } from '../models/customer';
import { CustomerService } from '../services/customer.service';
import { Utils } from '../shared/classes/utils';

@Component({
    selector: 'app-customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class CustomerListComponent implements OnInit {

    customers: ICustomer[];
    filteredCustomers: ICustomer[];

    constructor(private service: CustomerService) { }

    ngOnInit() {
        get('script.js', () => { });
        this.service.getCustomers().subscribe(data => this.filteredCustomers = this.customers = data, error => Utils.ErrorLogger(error));
    }

    filter(query: string) {
        this.filteredCustomers = query ? this.customers.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.customers;
    }

}
