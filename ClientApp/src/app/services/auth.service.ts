import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ILogin } from '../models/login'
import * as jwt_decode from 'jwt-decode'

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private url: string = 'https://localhost:44322/login'

    constructor(private router: Router, private http: HttpClient) { }

    login(formData: ILogin) {
        return this.http.post<ILogin>(this.url, formData)
    }

    logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('date')
        this.router.navigate(['/login'])
    }

    isLoggedIn(): boolean {
        return localStorage.getItem('token') != null
    }

    isTokenExpired(): boolean {
        let decodedToken = this.getDecodedToken()
        let expireDate = decodedToken['exp']
        let currentTime = new Date().getTime() / 1000

        return currentTime > expireDate
    }

    getToken(): string | null {
        var token = localStorage.getItem('token')

        return token
    }

    getDecodedToken(): {} | null {
        var i = localStorage.getItem('token')
        let decodedToken = jwt_decode(i)
        if (decodedToken) {
            return decodedToken
        }
        else {
            return null
        }
    }

}
