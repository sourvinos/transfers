import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';

@Injectable({ providedIn: 'root' })

export class UserService extends DataService {

    constructor(httpClient: HttpClient) {
        super(httpClient, '/api/users')
    }

    updatePassword(formData: any): Observable<any> {
        return this.http.post<any>('/api/account/changePassword/', formData)
    }

}
