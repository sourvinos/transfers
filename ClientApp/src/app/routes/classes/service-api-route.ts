import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { DataService } from 'src/app/shared/services/data.service'
import { Route } from '@angular/compiler/src/core'

@Injectable({ providedIn: 'root' })

export class RouteService extends DataService {

    constructor(private httpClient: HttpClient) {
        super(httpClient, '/api/routes')
    }

    async getRoute(id: number) {
        return await this.http.get<Route>(this.url + '/' + id).toPromise()
    }

}
