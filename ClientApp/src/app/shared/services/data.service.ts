import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

export class DataService {

    constructor(public http: HttpClient, public url: string) { }

    getAll(): Observable<any[]> {
        return this.http.get<any[]>(this.url)
    }

    getSingle(id: string | number) {
        return this.http.get<any>(this.url + '/' + id)
    }

    add(formData: any): Observable<any> {
        return this.http.post<any>(this.url, formData)
    }

    update(id: string | number, formData: any): Observable<any> {
        return this.http.put<any>(this.url + '/' + id, formData)
    }

    delete(id: string | number): Observable<any> {
        return this.http.delete<any>(this.url + '/' + id)
    }

}
