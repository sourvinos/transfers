import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { DataService } from 'src/app/shared/services/data.service'

@Injectable({ providedIn: 'root' })

export class UserService extends DataService {

    constructor(private httpClient: HttpClient) {
        super(httpClient, '/api/users')
    }

}
