import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ICountry } from '../models/country';

@Injectable({
    providedIn: 'root'
})

export class CountryService {

    private url: string = 'https://localhost:5001/api/country';

    constructor(private http: HttpClient) { }

    getCountries(): Observable<ICountry[]> {
        return this.http.get<ICountry[]>(this.url);
    }

    getCountry(countryId: string): Observable<ICountry> {
        return this.http.get<ICountry>(this.url + '/' + countryId);
    }

    addCountry(formData: ICountry): Observable<ICountry> {
        return this.http.post<ICountry>(this.url, formData);
    }

    updateCountry(countryId: string, formData: ICountry): Observable<ICountry> {
        return this.http.put<ICountry>(this.url + '/' + countryId, formData);
    }

    deleteCountry(countryId: string): Observable<ICountry> {
        return this.http.delete<ICountry>(this.url + '/' + countryId);
    }

}
