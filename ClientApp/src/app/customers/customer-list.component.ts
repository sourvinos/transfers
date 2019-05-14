import { Component, OnInit } from '@angular/core';
import { get } from 'scriptjs';

import { CustomerService } from '../services/customer.service';
import { ICustomer } from '../models/customer';
import { Utils } from '../shared/classes/utils';
import { $ } from 'protractor';

@Component({
    selector: 'app-customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.css']
})

export class CustomerListComponent implements OnInit {

    customers: ICustomer[];
    filteredCustomers: ICustomer[];

    constructor(private service: CustomerService) { }

    triggerEvent(elem, event) {
        var clickEvent = new Event(event);
        elem.dispatchEvent(clickEvent);
    }

    ngOnInit() {
        get('script.js', () => { });
        this.service.getCustomers().subscribe(data => this.filteredCustomers = this.customers = data, error => Utils.ErrorLogger(error));
    }

    filter(query: string) {
        this.filteredCustomers = query ? this.customers.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.customers;
    }

}
