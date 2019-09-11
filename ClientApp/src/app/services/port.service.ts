// Base
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Custom
import { IPort } from '../models/port';

@Injectable({ providedIn: 'root' })

export class PortService {

    private url: string = '/api/ports';

    constructor(private http: HttpClient) { }

    getPorts(): Observable<any> {
        return this.http.get<IPort[]>(this.url);
    }

    getPort(id: number): Observable<IPort> {
        return this.http.get<IPort>(this.url + '/' + id);
    }

    addPort(formData: IPort): Observable<IPort> {
        return this.http.post<IPort>(this.url, formData);
    }

    updatePort(id: number, formData: IPort): Observable<IPort> {
        return this.http.put<IPort>(this.url + '/' + id, formData);
    }

    deletePort(id: number): Observable<IPort> {
        return this.http.delete<IPort>(this.url + '/' + id);
    }

    createPDF(): Observable<HttpResponse<Blob>> {
        return this.http.get('pdf/create', { responseType: 'blob', observe: 'response' })
    }
}



