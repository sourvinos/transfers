import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';

@Injectable({ providedIn: 'root' })

export class UserService extends DataService {

    private confirmEmailUrl = 'api/users/changePassword'

    constructor(private httpClient: HttpClient) {
        super(httpClient, '/api/users')
    }

    updatePassword(formData: any): Observable<any> {
        return this.http.post<any>('/api/account/changePassword/', formData)
    }

    confirmEmail(userId: string, token: string): Observable<any> {
        return this.http.get<any>(this.confirmEmailUrl + '/' + userId + '/' + token)
    }

    messages() {
        const ok = 'Record saved'
    }

}
