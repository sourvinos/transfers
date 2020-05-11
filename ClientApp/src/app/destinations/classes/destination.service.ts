import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { DataService } from 'src/app/shared/services/data.service'

@Injectable({ providedIn: 'root' })

export class DestinationService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, '/api/destinations')
    }

}
