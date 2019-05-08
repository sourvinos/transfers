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

	updateDestination(DestinationId: number, formData: IDestination): Observable<IDestination> {
		console.log("Updating" + formData)
		return this.http.put<IDestination>(this.url + '/' + DestinationId, formData);
	}

	deleteDestination(DestinationId: number): Observable<IDestination> {
		return this.http.delete<IDestination>(this.url + '/' + DestinationId);
	}

}
