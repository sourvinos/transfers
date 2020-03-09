import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { DataService } from 'src/app/shared/services/data.service'
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })

export class AccountService {

    constructor(public http: HttpClient, public url: string) { }

    forgotPassword(formData: any): Observable<any> {
        return this.http.post<any>(this.url + '/', formData)
    }

}
