import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'

import { ICustomer } from '../models/customer'
import { tap } from 'rxjs/operators'

@Injectable({ providedIn: 'root' })

export class CustomerService {

    private url: string = '/api/customers'
    private _refreshNeeded = new Subject<void>()

    constructor(private http: HttpClient) { }

    get refreshNeeded() {
        return this._refreshNeeded
    }

    getCustomers(): Observable<ICustomer[]> {
        return this.http.get<ICustomer[]>(this.url)
    }

    getCustomer(id: number): Observable<ICustomer> {
        return this.http.get<ICustomer>(this.url + '/' + id)
    }

    addCustomer(formData: ICustomer): Observable<ICustomer> {
        return this.http.post<ICustomer>(this.url, formData).pipe(tap(() => { this._refreshNeeded.next() }))
    }

    updateCustomer(id: number, formData: ICustomer): Observable<ICustomer> {
        return this.http.put<ICustomer>(this.url + '/' + id, formData)
    }

    deleteCustomer(id: number): Observable<ICustomer> {
        return this.http.delete<ICustomer>(this.url + '/' + id)
    }

}
