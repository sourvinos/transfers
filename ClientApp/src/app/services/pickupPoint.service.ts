import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IPickupPoint } from '../models/pickupPoint';
import { IRoute } from '../models/route';

@Injectable({
    providedIn: 'root'
})

export class PickupPointService {

    private routesUrl: string = "https://localhost:44322/api/routes";
    private url: string = 'https://localhost:44322/api/pickupPoints';

    constructor(private http: HttpClient) { }

    getRoutes(): Observable<IRoute[]> {
        return this.http.get<IRoute[]>(this.routesUrl);
    }

    getPickupPoints(): Observable<IPickupPoint[]> {
        return this.http.get<IPickupPoint[]>(this.url);
    }

    getPickupPoint(id: string): Observable<IPickupPoint> {
        return this.http.get<IPickupPoint>(this.url + '/' + id);
    }

    addPickupPoint(formData: IPickupPoint): Observable<IPickupPoint> {
        return this.http.post<IPickupPoint>(this.url, formData);
    }

    updatePickupPoint(id: string, formData: IPickupPoint): Observable<IPickupPoint> {
        return this.http.put<IPickupPoint>(this.url + '/' + id, formData);
    }

    deletePickupPoint(id: string): Observable<IPickupPoint> {
        return this.http.delete<IPickupPoint>(this.url + '/' + id);
    }

}
