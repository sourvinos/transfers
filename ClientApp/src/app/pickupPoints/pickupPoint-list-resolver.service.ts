import { Injectable } from '@angular/core';
import { ActivatedRoute, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { IPickupPoint } from '../models/pickupPoint';
import { PickupPointService } from '../services/pickupPoint.service';

@Injectable({ providedIn: 'root' })

export class PickupPointListResolverService implements Resolve<IPickupPoint[]>{

    id: number = 0

    constructor(private pickupPointService: PickupPointService, private activatedRoute: ActivatedRoute) {
        this.activatedRoute.params.subscribe(p => (this.id = 31))
        // this.activatedRoute.params.subscribe(p => (this.id = p['id']))
    }

    resolve(): Observable<IPickupPoint[]> {
        return this.pickupPointService.getPickupPoints(this.id)
    }

}