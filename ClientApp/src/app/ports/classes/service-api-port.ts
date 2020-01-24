import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { DataService } from 'src/app/services/data.service'

@Injectable({ providedIn: 'root' })

export class PortService extends DataService {

    constructor(private httpClient: HttpClient) {
        super(httpClient, '/api/ports')
    }

    createPDF(): Observable<HttpResponse<Blob>> {
        return this.http.get('pdf/create', { responseType: 'blob', observe: 'response' })
    }
}



