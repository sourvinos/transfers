import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ICustomer } from '../models/customer';

@Injectable({
    providedIn: 'root'
})

export class CustomerService {

    private url: string = 'https://localhost:44322/api/customers';

    constructor(private http: HttpClient) { }

    getCustomers(): Observable<ICustomer[]> {
        return this.http.get<ICustomer[]>(this.url);
    }

    getCustomer(id: string): Observable<ICustomer> {
        return this.http.get<ICustomer>(this.url + '/' + id);
    }

    addCustomer(formData: ICustomer): Observable<ICustomer> {
        return this.http.post<ICustomer>(this.url, formData);
    }

    updateCustomer(id: string, formData: ICustomer): Observable<ICustomer> {
        return this.http.put<ICustomer>(this.url + '/' + id, formData);
    }

    deleteCustomer(id: string): Observable<ICustomer> {
        return this.http.delete<ICustomer>(this.url + '/' + id);
    }

}
