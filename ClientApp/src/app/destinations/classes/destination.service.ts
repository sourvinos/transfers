import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { DataService } from 'src/app/shared/services/data.service'
import { Destination } from './destination'
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })

export class DestinationService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, '/api/destinations')
    }

    getAllActive(): Observable<Destination[]> {
        return this.http.get<Destination[]>('/api/destinations/getActive')
    }

}
