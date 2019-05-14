import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IDestination } from '../models/destination';

@Injectable({
	providedIn: 'root'
})

export class DestinationService {

	private url: string = 'https://localhost:44322/api/destinations';

	constructor(private http: HttpClient) { }

	getDestinations(): Observable<IDestination[]> {
		return this.http.get<IDestination[]>(this.url);
	}

	getDestination(id: number): Observable<IDestination> {
		return this.http.get<IDestination>(this.url + '/' + id);
	}

	addDestination(formData: IDestination): Observable<IDestination> {
		return this.http.post<IDestination>(this.url, formData);
	}

	updateDestination(id: number, formData: IDestination): Observable<IDestination> {
		return this.http.put<IDestination>(this.url + '/' + id, formData);
	}

	deleteDestination(id: number): Observable<IDestination> {
		return this.http.delete<IDestination>(this.url + '/' + id);
	}

}
