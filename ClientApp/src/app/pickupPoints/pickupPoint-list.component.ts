import { Component, OnInit } from '@angular/core';
import { get } from 'scriptjs';

import { IPickupPoint } from '../models/pickupPoint';
import { IRoute } from '../models/route';
import { PickupPointService } from '../services/pickupPoint.service';
import { RouteService } from '../services/route.service';
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
        route: {
            id: 0,
            abbreviation: '',
            description: '',
            port: {
                id: 0,
                description: '',
                userName: ''
            },
            isSelected: false,
            userName: ''
        },
        description: '',
        exactPoint: '',
        time: '',
        userName: '',
    }

    constructor(private routeService: RouteService, private pickupPointService: PickupPointService) { }

    ngOnInit() {
        this.routeService.getRoutes().subscribe(data => this.routes = data, error => Utils.ErrorLogger(error))
    }

    onRouteChange() {
        this.populatePickupPoints()
    }

    private populatePickupPoints() {
        this.pickupPointService.getPickupPoints(this.pickupPoint.route.id).subscribe(data => this.pickupPoints = data, error => Utils.ErrorLogger(error));
    }
}