import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { DataService } from 'src/app/services/data.service'
import { Observable } from 'rxjs'
import { QueryResult } from './model-viewModel-transfer'

@Injectable({ providedIn: 'root' })

export class TransferService extends DataService {

    constructor(http: HttpClient) {
        super(http, '/api/transfers')
    }

    getTransfers(date: string): Observable<QueryResult[]> {
        return this.http.get<QueryResult[]>('/api/transfers/date/' + date)
    }

    assignDriver(driverId: string, ids: string[]) {
        let params = new HttpParams().set('driverId', driverId).set('id', ids[0])
        ids.forEach((element, index) => {
            if (index > 0) {
                params = params.append('id', element)
            }
        })
        return this.http.patch(this.url + '/assignDriver?', null, { params: params })
    }

}
