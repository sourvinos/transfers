import { Component, OnInit } from '@angular/core';

import { IRoute } from '../models/route';
import { IPickupPoint } from '../models/pickupPoint';
import { PickupPointService } from '../services/pickupPoint.service';
import { Utils } from '../shared/classes/utils';

@Component({
    selector: 'pickupPoint-list',
    templateUrl: './pickupPoint-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class PickupPointListComponent implements OnInit {

    routes: any;
    pickupPoints: IPickupPoint[];

    pickupPoint: IPickupPoint = {
        id: 0,
        routeId: 0,
        description: '',
        exactPoint: '',
        time: '',
        user: '',
    }

    constructor(private service: PickupPointService) { }

    ngOnInit() {
        this.service.getRoutes().subscribe(data => this.routes = data, error => Utils.ErrorLogger(error))
    }

    onRouteChange() {
        this.populatePickupPoints()
    }

    private populatePickupPoints() {
        const selectedRoute = this.routes.find((x: { id: any }) => x.id == this.pickupPoint.routeId)
        this.pickupPoints = selectedRoute ? selectedRoute.pickupPoints : []
    }
}