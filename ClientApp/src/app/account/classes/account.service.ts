import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })

export class AccountService {

    constructor(public http: HttpClient) { }

    resetPassword(formData: any): Observable<any> {
        return this.http.post<any>('api/account/resetPassword', formData)
    }

}
