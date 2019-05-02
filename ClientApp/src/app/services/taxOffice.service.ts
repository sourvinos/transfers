import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IKeyValuePair } from '../models/keyValuePair';

@Injectable({
    providedIn: 'root'
})

export class TaxOfficeService {

    private url: string = 'https://localhost:44322/api/taxoffices/';

    constructor(private http: HttpClient) { }

    getTaxOffices(): Observable<IKeyValuePair[]> {
        return this.http.get<IKeyValuePair[]>(this.url);
    }

    getTaxOffice(id: string): Observable<IKeyValuePair> {
        return this.http.get<IKeyValuePair>(this.url + id);
    }

    addTaxOffice(formData: IKeyValuePair): Observable<IKeyValuePair> {
        return this.http.post<IKeyValuePair>(this.url, formData);
    }

    updateTaxOffice(id: string, formData: IKeyValuePair): Observable<IKeyValuePair> {
        return this.http.put<IKeyValuePair>(this.url + id, formData);
    }

    deleteTaxOffice(id: string): Observable<IKeyValuePair> {
        return this.http.delete<IKeyValuePair>(this.url + id);
    }

}
