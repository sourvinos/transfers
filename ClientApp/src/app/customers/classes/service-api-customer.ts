import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { DataService } from 'src/app/services/data.service'

@Injectable({ providedIn: 'root' })

export class CustomerService extends DataService {

    constructor(private httpClient: HttpClient) {
        super(httpClient, '/api/customers')
    }

}
