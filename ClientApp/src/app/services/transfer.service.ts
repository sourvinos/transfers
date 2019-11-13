import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable, Subject } from "rxjs"
import { tap } from "rxjs/operators"
import { IQueryResult } from "../models/queryResult"
import { ITransfer } from "../models/transfer"

@Injectable({ providedIn: "root" })

export class TransferService {

    private url: string = "/api/transfers"
    private isRefreshNeeded = new Subject<void>()

    constructor(private http: HttpClient) { }

    get refreshNeeded() {
        return this.isRefreshNeeded
    }

    async getTransfers(date: string) {
        return await this.http.get<IQueryResult[]>(this.url + "/" + "getByDate" + "/" + date).toPromise()
    }

    getTransfer(id: number): Observable<ITransfer> {
        return this.http.get<ITransfer>(this.url + "/" + id.toString())
    }

    addTransfer(formData: ITransfer): Observable<ITransfer> {
        return this.http.post<ITransfer>(this.url, formData).pipe(tap(() => this.isRefreshNeeded.next()))
    }

    updateTransfer(id: number, formData: ITransfer): Observable<ITransfer> {
        return this.http.put<ITransfer>(this.url + "/" + id, formData).pipe(tap(() => { this.isRefreshNeeded.next() }))
    }

    deleteTransfer(id: number): Observable<ITransfer> {
        return this.http.delete<ITransfer>(this.url + "/" + id).pipe(tap(() => { this.isRefreshNeeded.next() }))
    }

}
