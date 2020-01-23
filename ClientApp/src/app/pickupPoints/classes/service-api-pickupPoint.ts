import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPickupPoint } from './model-pickupPoint';

@Injectable({ providedIn: 'root' })

export class PickupPointService {

    private url: string = '/api/pickupPoints'

    constructor(private http: HttpClient) { }

    getAll(): Observable<IPickupPoint[]> {
        return this.http.get<IPickupPoint[]>(this.url)
    }

    getAllForRoute(routeId: string): Observable<IPickupPoint[]> {
        return this.http.get<IPickupPoint[]>(this.url + '/routeId/' + routeId)
    }

    getSingle(id: number): Observable<IPickupPoint> {
        return this.http.get<IPickupPoint>(this.url + '/' + id.toString())
    }

    add(formData: IPickupPoint): Observable<IPickupPoint> {
        return this.http.post<IPickupPoint>(this.url, formData)
    }

    update(id: number, formData: IPickupPoint): Observable<IPickupPoint> {
        return this.http.put<IPickupPoint>(this.url + '/' + id, formData)
    }

    delete(id: number): Observable<IPickupPoint> {
        return this.http.delete<IPickupPoint>(this.url + '/' + id)
    }

}
