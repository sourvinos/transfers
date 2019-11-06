import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IRoute } from '../models/route';
import { RouteService } from '../services/route.service';

@Injectable({ providedIn: 'root' })

export class RouteListResolverService implements Resolve<IRoute[]>{

    constructor(private routeService: RouteService) { }

    resolve(): Observable<IRoute[]> {
        return this.routeService.getRoutes().pipe(delay(100))
    }

}