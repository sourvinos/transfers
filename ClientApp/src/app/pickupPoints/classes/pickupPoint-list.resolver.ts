import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { PickupPoint } from './pickupPoint';
import { PickupPointService } from './pickupPoint.service';

@Injectable({ providedIn: 'root' })

export class PickupPointListResolver implements Resolve<PickupPoint[]> {

    constructor(private pickupPointService: PickupPointService) { }

    resolve(): Observable<PickupPoint[]> {
        return this.pickupPointService.getAll()
    }

}
