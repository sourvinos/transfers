import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router'
import { Observable } from 'rxjs'
import { Customer } from './customer'
import { CustomerService } from './customer.service'

@Injectable({ providedIn: 'root' })

export class CustomerListResolver implements Resolve<Customer[]> {

    constructor(private customerService: CustomerService) { }

    resolve(): Observable<Customer[]> {
        return this.customerService.getAll()
    }

}
