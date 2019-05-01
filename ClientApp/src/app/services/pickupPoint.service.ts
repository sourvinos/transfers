import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IPickupPoint } from '../models/pickupPoint';
import { IRoute } from '../models/route';

@Injectable({
    providedIn: 'root'
})

export class PickupPointService {

    private baseUrl: string = "https://localhost:44322/api"
    private url: string = this.baseUrl + '/pickupPoints'

    constructor(private http: HttpClient) { }

    getRoutes() {
        return this.http.get(this.baseUrl + '/routes');
    }

    getPickupPoints(): Observable<IPickupPoint[]> {
        return this.http.get<IPickupPoint[]>(this.url);
    }

    getPickupPoint(id: number): Observable<IPickupPoint> {
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
