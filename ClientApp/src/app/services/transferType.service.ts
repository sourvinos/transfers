import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ITransferType } from '../models/transferType';

@Injectable({
    providedIn: 'root'
})

export class TransferTypeService {

    private url: string = 'https://localhost:44322/api/transferTypes/';

    constructor(private http: HttpClient) { }

    getTransferTypes(): Observable<ITransferType[]> {
        return this.http.get<ITransferType[]>(this.url);
    }

    getTransferType(id: number): Observable<ITransferType> {
        return this.http.get<ITransferType>(this.url + id);
    }

    addTransferType(formData: ITransferType): Observable<ITransferType> {
        return this.http.post<ITransferType>(this.url, formData);
    }

    updateTransferType(id: number, formData: ITransferType): Observable<ITransferType> {
        return this.http.put<ITransferType>(this.url + id, formData);
    }

    deleteTransferType(id: number): Observable<ITransferType> {
        return this.http.delete<ITransferType>(this.url + id);
    }

}
