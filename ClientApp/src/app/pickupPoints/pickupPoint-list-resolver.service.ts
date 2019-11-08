import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IPickupPoint } from '../models/pickupPoint';
import { PickupPointService } from '../services/pickupPoint.service';

@Injectable({ providedIn: 'root' })

export class PickupPointListResolverService implements Resolve<IPickupPoint[]>{

    id: number = 0

    constructor(private pickupPointService: PickupPointService, private activatedRoute: ActivatedRoute) { }

    resolve(activatedRoute: ActivatedRouteSnapshot): Observable<IPickupPoint[]> {
        let routeId = parseInt(activatedRoute.params.id)
        return this.pickupPointService.getPickupPoints(routeId).pipe(delay(100))
    }

}