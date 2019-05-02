import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IPickupPoint } from '../models/pickupPoint';

@Injectable({
    providedIn: 'root'
})

export class PickupPointService {

    private routeurl: string = 'https://localhost:44322/api/routes/';
    private url: string = 'https://localhost:44322/api/pickuppoints/';

    constructor(private http: HttpClient) { }

    getRoutes() {
        return this.http.get(this.routeurl);
    }

    getPickupPoints(): Observable<IPickupPoint[]> {
        return this.http.get<IPickupPoint[]>(this.url);
    }

    getPickupPoint(id: number): Observable<IPickupPoint> {
        return this.http.get<IPickupPoint>(this.url + id);
    }

    addPickupPoint(formData: IPickupPoint): Observable<IPickupPoint> {
        return this.http.post<IPickupPoint>(this.url, formData);
    }

    updatePickupPoint(id: number, formData: IPickupPoint): Observable<IPickupPoint> {
        return this.http.put<IPickupPoint>(this.url + id, formData);
    }

    deletePickupPoint(id: number): Observable<IPickupPoint> {
        return this.http.delete<IPickupPoint>(this.url + id);
    }

}
