import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })

export class DataService {

    constructor(public http: HttpClient, public url: string) { }

    getAll(): Observable<any[]> {
        return this.http.get<any[]>(this.url)
    }

    async getSingle(id: string | number) {
        return await this.http.get<any>(this.url + '/' + id).toPromise()
    }

    add(formData: any): Observable<any> {
        return this.http.post<any>(this.url, formData)
    }

    update(id: string | number, formData: any): Observable<any> {
        return this.http.put<any>(this.url + '/' + id, formData)
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>(this.url + '/' + id)
    }

}
