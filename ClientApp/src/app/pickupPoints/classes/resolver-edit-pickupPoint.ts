import { IPickupPoint } from './model-pickupPoint';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { PickupPointService } from './service-api-pickupPoint';

@Injectable({ providedIn: 'root' })

export class PickupPointEditResolverService implements Resolve<IPickupPoint>{

    constructor(private pickupPointService: PickupPointService) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.pickupPointService.getSingle(route.params.pickupPointId)
    }

}