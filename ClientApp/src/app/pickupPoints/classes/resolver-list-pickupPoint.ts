import { PickupPoint } from './model-pickupPoint';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { PickupPointService } from './service-api-pickupPoint';

@Injectable({ providedIn: 'root' })

export class PickupPointListResolverService implements Resolve<PickupPoint[]>{

    constructor(private pickupPointService: PickupPointService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<PickupPoint[]> {
        return this.pickupPointService.getAllForRoute(route.params.routeId)
    }

}