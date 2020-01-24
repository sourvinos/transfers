import { Injectable } from '@angular/core';
import { Resolve, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { RouteService } from './service-api-route';

@Injectable({ providedIn: 'root' })

export class RouteListResolverService implements Resolve<Route[]>{

    constructor(private routeService: RouteService) { }

    resolve(): Observable<Route[]> {
        return this.routeService.getAll()
    }

}