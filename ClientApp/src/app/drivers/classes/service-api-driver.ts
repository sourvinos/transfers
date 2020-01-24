import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Driver } from './model-driver';

@Injectable({ providedIn: 'root' })

export class DriverService extends DataService {

    constructor(private httpClient: HttpClient) {
        super(httpClient, '/api/drivers')
    }

    async getDefaultDriver() {
        return await this.http.get<Driver>(this.url + '/' + 'getDefault').toPromise()
    }

}
