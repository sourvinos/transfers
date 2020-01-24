import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPickupPoint } from './model-pickupPoint';
import { DataService } from 'src/app/services/data.service';

@Injectable({ providedIn: 'root' })

export class PickupPointService extends DataService {

    constructor(http: HttpClient) {
        super(http, '/api/pickupPoints')
    }

    getAllForRoute(routeId: string): Observable<IPickupPoint[]> {
        return this.http.get<IPickupPoint[]>('/api/pickupPoints/routeId/' + routeId)
    }

}
