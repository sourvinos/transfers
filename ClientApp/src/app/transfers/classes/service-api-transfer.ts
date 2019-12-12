import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { IQueryResult } from "src/app/models/queryResult"
import { ITransfer } from "./model-transfer"

@Injectable({ providedIn: "root" })

export class TransferService {

    private url: string = "/api/transfers"

    constructor(private http: HttpClient) { }

    getTransfers(date: string): Observable<IQueryResult[]> {
        return this.http.get<IQueryResult[]>(this.url + "/date/" + date)
    }

    getTransfer(id: number): Observable<ITransfer> {
        return this.http.get<ITransfer>(this.url + "/" + id.toString())
    }

    addTransfer(formData: ITransfer): Observable<ITransfer> {
        return this.http.post<ITransfer>(this.url, formData)
    }

    updateTransfer(id: number, formData: ITransfer): Observable<ITransfer> {
        return this.http.put<ITransfer>(this.url + "/" + id, formData)
    }

    deleteTransfer(id: number): Observable<ITransfer> {
        return this.http.delete<ITransfer>(this.url + "/" + id)
    }

}