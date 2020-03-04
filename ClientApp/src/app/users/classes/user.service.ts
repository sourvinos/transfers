import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { DataService } from 'src/app/shared/services/data.service'
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })

export class UserService extends DataService {

    constructor(private httpClient: HttpClient) {
        super(httpClient, '/api/users')
    }

    updatePassword(id: string | number, formData: any): Observable<any> {
        return this.http.post<any>(this.url + '/' + id, formData)
    }

}
