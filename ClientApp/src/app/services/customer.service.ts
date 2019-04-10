import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ICustomer } from '../models/customer';

@Injectable({
    providedIn: 'root'
})

export class CustomerService {

    private url: string = 'https://localhost:44322/api/customer';

    constructor(private http: HttpClient) { }

    getCustomers(): Observable<ICustomer[]> {
        return this.http.get<ICustomer[]>(this.url);
    }

    getCustomer(CustomerId: string): Observable<ICustomer> {
        return this.http.get<ICustomer>(this.url + '/' + CustomerId);
    }

    addCustomer(formData: ICustomer): Observable<ICustomer> {
        return this.http.post<ICustomer>(this.url, formData);
    }

    updateCustomer(CustomerId: string, formData: ICustomer): Observable<ICustomer> {
        return this.http.put<ICustomer>(this.url + '/' + CustomerId, formData);
    }

    deleteCustomer(CustomerId: string): Observable<ICustomer> {
        return this.http.delete<ICustomer>(this.url + '/' + CustomerId);
    }

}
