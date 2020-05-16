import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { DataService } from 'src/app/shared/services/data.service'
import { Observable } from 'rxjs'
import { Route } from './route'

@Injectable({ providedIn: 'root' })

export class RouteService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, '/api/routes')
    }

    getAllActive(): Observable<Route[]> {
        return this.http.get<Route[]>('/api/routes/getActive')
    }

}
