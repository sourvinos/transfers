
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IKeyValuePair } from '../models/keyValuePair';

@Injectable({
    providedIn: 'root'
})

export class VatStateService {

    private url: string = 'https://localhost:44322/api/vatstates/';

    constructor(private http: HttpClient) { }

    getVatStates(): Observable<IKeyValuePair[]> {
        return this.http.get<IKeyValuePair[]>(this.url);
    }

    getVatState(id: string): Observable<IKeyValuePair> {
        return this.http.get<IKeyValuePair>(this.url + id);
    }

    addVatState(formData: IKeyValuePair): Observable<IKeyValuePair> {
        return this.http.post<IKeyValuePair>(this.url, formData);
    }

    updateVatState(id: string, formData: IKeyValuePair): Observable<IKeyValuePair> {
        return this.http.put<IKeyValuePair>(this.url + id, formData);
    }

    deleteVatState(id: string): Observable<IKeyValuePair> {
        return this.http.delete<IKeyValuePair>(this.url + id);
    }

}
