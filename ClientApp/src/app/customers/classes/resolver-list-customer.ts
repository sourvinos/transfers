import { Injectable } from '@angular/core'
import { Resolve } from '@angular/router'
import { Observable } from 'rxjs'
import { ICustomer } from './model-customer'
import { CustomerService } from './service-api-customer'

@Injectable({ providedIn: 'root' })

export class CustomerListResolverService implements Resolve<ICustomer[]>{

    constructor(private customerService: CustomerService) { }

    resolve(): Observable<ICustomer[]> {
        return this.customerService.getCustomers()
    }

}