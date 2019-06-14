import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ITransfer } from '../models/transfer';

@Injectable({
    providedIn: 'root'
})

export class TransferService {

    private url: string = 'https://localhost:44322/api/transfers/';

    constructor(private http: HttpClient) { }

    getTransfers(date: string): Observable<ITransfer[]> {
        return this.http.get<ITransfer[]>(this.url + 'getByDate' + '/' + date);
    }

    getTransfer(id: number): Observable<ITransfer> {
        return this.http.get<ITransfer>(this.url + id);
    }

    addTransfer(formData: ITransfer): Observable<ITransfer> {
        return this.http.post<ITransfer>(this.url, formData);
    }

    updateTransfer(id: number, formData: ITransfer): Observable<ITransfer> {
        return this.http.put<ITransfer>(this.url + id, formData);
    }

    deleteTransfer(id: number): Observable<ITransfer> {
        return this.http.delete<ITransfer>(this.url + id);
    }

}
