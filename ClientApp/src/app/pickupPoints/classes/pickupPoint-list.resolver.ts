import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { PickupPoint } from './pickupPoint';
import { PickupPointService } from './pickupPoint.service';

@Injectable({ providedIn: 'root' })

export class PickupPointListResolver implements Resolve<PickupPoint[]> {

    constructor(private pickupPointService: PickupPointService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<PickupPoint[]> {
        return this.pickupPointService.getAllForRoute(route.params.routeId)
    }

}
