import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { DataService } from 'src/app/shared/services/data.service'
import { catchError, retry } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })

export class UserService extends DataService {

    private confirmEmailUrl = 'api/users/changePassword'

    constructor(private httpClient: HttpClient) {
        super(httpClient, '/api/account/register')
    }

    updatePassword(id: string | number, formData: any): Observable<any> {
        return this.http.post<any>(this.url + '/' + id, formData)
    }

    confirmEmail(userId: string, token: string): Observable<any> {
        return this.http.get<any>(this.confirmEmailUrl + '/' + userId + '/' + token)
    }

}
