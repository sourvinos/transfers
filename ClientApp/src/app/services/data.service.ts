import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })

export class DataService {

    constructor(private http: HttpClient, private url: string) { }

    get() {
        return this.http.get<any[]>(this.url)
    }

    getSingle(id: number) {
        return this.http.get(this.url + '/' + id.toString())
    }

    add(formData: any): Observable<any> {
        return this.http.post<any>(this.url, formData)
    }

    update(id: number, formData: any): Observable<any> {
        return this.http.put<any>(this.url + '/' + id, formData)
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>(this.url + '/' + id)
    }

}
