import { IPickupPoint } from './model-pickupPoint';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { PickupPointService } from './service-api-pickupPoint';

@Injectable({ providedIn: 'root' })

export class PickupPointListResolverService implements Resolve<IPickupPoint[]>{

    dateIn: string

    constructor(private pickupPointService: PickupPointService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<IPickupPoint[]> {
        return this.pickupPointService.getPickupPoints(route.params.routeId)
    }

}