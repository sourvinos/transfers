import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IDriver } from '../models/driver';

@Injectable({
    providedIn: 'root'
})

export class DriverService {

    private url: string = 'https://localhost:44322/api/drivers/';

    constructor(private http: HttpClient) { }

    getDrivers(): Observable<IDriver[]> {
        return this.http.get<IDriver[]>(this.url);
    }

    getDriver(id: number): Observable<IDriver> {
        return this.http.get<IDriver>(this.url + id);
    }

    addDriver(formData: IDriver): Observable<IDriver> {
        return this.http.post<IDriver>(this.url, formData);
    }

    updateDriver(id: number, formData: IDriver): Observable<IDriver> {
        return this.http.put<IDriver>(this.url + id, formData);
    }

    deleteDriver(id: number): Observable<IDriver> {
        return this.http.delete<IDriver>(this.url + id);
    }

}
