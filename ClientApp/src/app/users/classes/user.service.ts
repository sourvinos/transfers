import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { DataService } from 'src/app/shared/services/data.service'

@Injectable({ providedIn: 'root' })

export class UserService extends DataService {

    private confirmEmailUrl = 'api/account/confirmEmail'

    constructor(private httpClient: HttpClient) {
        super(httpClient, '/api/users')
    }

    updatePassword(id: string | number, formData: any): Observable<any> {
        return this.http.post<any>(this.url + '/' + id, formData)
    }

    confirmEmail(userId: string, token: string): Observable<any> {
        return this.http.get<any>(this.confirmEmailUrl + '/' + userId + '/' + token)
    }

}
