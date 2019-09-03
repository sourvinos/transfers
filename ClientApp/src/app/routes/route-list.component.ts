// Base
import { Component, OnInit } from '@angular/core';
import { get } from 'scriptjs';
// Custom
import { IRoute } from '../models/route';
import { RouteService } from '../services/route.service';
import { Utils } from '../shared/classes/utils';

@Component({
    selector: 'route-list',
    templateUrl: './route-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class RouteListComponent implements OnInit {

    coachRoutes: IRoute[];
    filteredRoutes: IRoute[];

    constructor(private service: RouteService) { }

    ngOnInit() {
        get('script.js', () => { });
        this.service.getRoutes().subscribe(data => this.filteredRoutes = this.coachRoutes = data, error => Utils.ErrorLogger(error));
    }

    filter(query: string) {
        this.filteredRoutes = query ? this.coachRoutes.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.coachRoutes;
    }

}
