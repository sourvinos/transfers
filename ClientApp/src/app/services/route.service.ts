// Base
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Custom
import { IRoute } from '../models/route';

@Injectable({ providedIn: 'root' })

export class RouteService {

    private url: string = '/api/routes';

    constructor(private http: HttpClient) { }

    getRoutes(): Observable<IRoute[]> {
        return this.http.get<IRoute[]>(this.url);
    }

    getRoute(id: number): Observable<IRoute> {
        return this.http.get<IRoute>(this.url + '/' + id);
    }

    addRoute(formData: IRoute): Observable<IRoute> {
        return this.http.post<IRoute>(this.url, formData);
    }

    updateRoute(RouteId: number, formData: IRoute): Observable<IRoute> {
        return this.http.put<IRoute>(this.url + '/' + RouteId, formData);
    }

    deleteRoute(RouteId: number): Observable<IRoute> {
        return this.http.delete<IRoute>(this.url + '/' + RouteId);
    }

}
