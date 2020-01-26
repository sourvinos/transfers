import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PickupPoint } from './model-pickupPoint';
import { DataService } from 'src/app/services/data.service';

@Injectable({ providedIn: 'root' })

export class PickupPointService extends DataService {

    constructor(http: HttpClient) {
        super(http, '/api/pickupPoints')
    }

    getAllForRoute(routeId: string): Observable<PickupPoint[]> {
        return this.http.get<PickupPoint[]>('/api/pickupPoints/routeId/' + routeId)
    }

}
