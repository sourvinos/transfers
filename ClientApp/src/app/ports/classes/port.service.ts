import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { DataService } from 'src/app/shared/services/data.service'
import { Port } from './port'

@Injectable({ providedIn: 'root' })

export class PortService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, '/api/ports')
    }

    getAllActive(): Observable<Port[]> {
        return this.http.get<Port[]>('/api/ports/getActive')
    }
    createPDF(): Observable<HttpResponse<Blob>> {
        return this.http.get('pdf/create', { responseType: 'blob', observe: 'response' })
    }
}



