// Base
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Custom
import { IVatState } from '../models/vatState';

@Injectable({
    providedIn: 'root'
})

export class VatStateService {

    private url: string = '/api/vatStates/';

    constructor(private http: HttpClient) { }

    getVatStates(): Observable<IVatState[]> {
        return this.http.get<IVatState[]>(this.url);
    }

    getVatState(id: number): Observable<IVatState> {
        return this.http.get<IVatState>(this.url + id);
    }

    addVatState(formData: IVatState): Observable<IVatState> {
        return this.http.post<IVatState>(this.url, formData);
    }

    updateVatState(id: number, formData: IVatState): Observable<IVatState> {
        return this.http.put<IVatState>(this.url + id, formData);
    }

    deleteVatState(id: number): Observable<IVatState> {
        return this.http.delete<IVatState>(this.url + id);
    }

}
