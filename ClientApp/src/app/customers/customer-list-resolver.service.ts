import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ICustomer } from '../models/customer';
import { CustomerService } from '../services/customer.service';

@Injectable({ providedIn: 'root' })

export class CustomerListResolverService implements Resolve<ICustomer[]>{

    constructor(private customerService: CustomerService) { }

    resolve(): Observable<ICustomer[]> {
        return this.customerService.getCustomers().pipe(delay(100))
    }

}