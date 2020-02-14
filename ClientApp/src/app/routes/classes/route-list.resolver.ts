import { Injectable } from '@angular/core';
import { Resolve, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { RouteService } from './route.service';

@Injectable({ providedIn: 'root' })

export class RouteListResolver implements Resolve<Route[]> {

    constructor(private routeService: RouteService) { }

    resolve(): Observable<Route[]> {
        return this.routeService.getAll()
    }

}
