import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';

@Injectable({ providedIn: 'root' })

export class PickupPointService extends DataService {

    constructor(http: HttpClient) {
        super(http, '/api/pickupPoints')
    }

}
