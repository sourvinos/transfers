import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILogin } from '../models/login';

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private url: string = 'https://localhost:5001/login';

    constructor(private http: HttpClient) { }

    login(formData: ILogin) {
        return this.http.post<ILogin>(this.url, formData);
    }

    logout() {
        localStorage.removeItem('token');
    }

    isLoggedIn(): boolean {
        return localStorage.getItem('token') != null;
    }

    getToken(): string | null {
        var i = localStorage.getItem('token');
        console.log('Token ' + i);
        if (i) {
            return i;
        }
        else {
            return null;
        }
    }

}
