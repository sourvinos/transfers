import { Injectable } from '@angular/core'
import { Resolve } from '@angular/router'
import { Observable } from 'rxjs'
import { Customer } from './model-customer'
import { CustomerService } from './service-api-customer'

@Injectable({ providedIn: 'root' })

export class CustomerListResolverService implements Resolve<Customer[]>{

    constructor(private customerService: CustomerService) { }

    resolve(): Observable<Customer[]> {
        return this.customerService.getAll()
    }

}