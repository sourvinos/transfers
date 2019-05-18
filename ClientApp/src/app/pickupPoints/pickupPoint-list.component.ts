import { Component, OnInit } from '@angular/core';
import { get } from 'scriptjs';

import { IRoute } from '../models/route';
import { IPickupPoint } from '../models/pickupPoint';
import { RouteService } from '../services/route.service';
import { PickupPointService } from '../services/pickupPoint.service';
import { Utils } from '../shared/classes/utils';

@Component({
    selector: 'pickupPoint-list',
    templateUrl: './pickupPoint-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class PickupPointListComponent implements OnInit {

    routes: IRoute[];
    pickupPoints: IPickupPoint[];

    pickupPoint: IPickupPoint = {
        id: 0,
        routeId: 0,
        description: '',
        exactPoint: '',
        time: '',
        user: '',
    }

    constructor(private routeService: RouteService, private pickupPointService: PickupPointService) { }

    ngOnInit() {
        get('script.js', () => { });
        this.routeService.getRoutes().subscribe(data => this.routes = data, error => Utils.ErrorLogger(error))
    }

    onRouteChange() {
        this.populatePickupPoints()
    }

    private populatePickupPoints() {
        this.pickupPointService.getPickupPoints(this.pickupPoint.routeId).subscribe(data => this.pickupPoints = data, error => Utils.ErrorLogger(error));
    }
}