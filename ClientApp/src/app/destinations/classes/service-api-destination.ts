import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { IDestination } from './model-destination'

@Injectable({ providedIn: 'root' })

export class DestinationService {

	private url: string = '/api/destinations'

	constructor(private http: HttpClient) { }

	getAll(): Observable<IDestination[]> {
		return this.http.get<IDestination[]>(this.url)
	}

	getSingle(id: number): Observable<IDestination> {
		return this.http.get<IDestination>(this.url + '/' + id)
	}

	add(formData: IDestination): Observable<IDestination> {
		return this.http.post<IDestination>(this.url, formData)
	}

	update(id: number, formData: IDestination): Observable<IDestination> {
		return this.http.put<IDestination>(this.url + '/' + id, formData)
	}

	delete(id: number): Observable<IDestination> {
		return this.http.delete<IDestination>(this.url + '/' + id)
	}

}
