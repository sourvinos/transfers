// Base
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Custom
import { ITaxOffice } from '../models/taxOffice';

@Injectable({
    providedIn: 'root'
})

export class TaxOfficeService {

    private url: string = '/api/taxoffices/';

    constructor(private http: HttpClient) { }

    getTaxOffices(): Observable<ITaxOffice[]> {
        return this.http.get<ITaxOffice[]>(this.url);
    }

    getTaxOffice(id: number): Observable<ITaxOffice> {
        return this.http.get<ITaxOffice>(this.url + id);
    }

    addTaxOffice(formData: ITaxOffice): Observable<ITaxOffice> {
        return this.http.post<ITaxOffice>(this.url, formData);
    }

    updateTaxOffice(id: number, formData: ITaxOffice): Observable<ITaxOffice> {
        return this.http.put<ITaxOffice>(this.url + id, formData);
    }

    deleteTaxOffice(id: number): Observable<ITaxOffice> {
        return this.http.delete<ITaxOffice>(this.url + id);
    }

}
