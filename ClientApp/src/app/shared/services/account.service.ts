import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable({ providedIn: 'root' })

export class AccountService {

    // #region Init

    private baseUrlRegister = '/api/account/register'
    private baseUrlForgotPassword = '/api/account/forgotPassword'
    private baseUrlResetPassword = '/api/account/resetPassword'
    private baseUrlToken = '/api/token/auth'

    private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus())
    private displayName = new BehaviorSubject<string>(localStorage.getItem('displayName'))

    // #endregion

    constructor(private httpClient: HttpClient, private router: Router) { }

    register(username: string, password: string, email: string) {
        return this.httpClient.post<any>(this.baseUrlRegister, { username, password, email })
    }

    login(username: string, password: string) {
        const grantType = 'password'
        return this.httpClient.post<any>(this.baseUrlToken, { username, password, grantType }).pipe(map(result => {
            if (result && result.authToken.token) {
                this.setLoginStatus(true)
                this.setLocalStorage(result.authToken)
                this.setDisplayName(result.authToken.displayName)
            }
        }))
    }

    logout() {
        this.clearLocalStorage()
        this.setLoginStatus(false)
        this.navigateToLogin()
    }

    forgotPassword(email: string) {
        return this.httpClient.post<any>(this.baseUrlForgotPassword, { email })
    }

    resetPassword(email: string, password: string, confirmPassword: string, token: string) {
        return this.httpClient.post<any>(this.baseUrlResetPassword, { email, password, confirmPassword, token })
    }

    getNewRefreshToken(): Observable<any> {
        const userName = localStorage.getItem('username')
        const refreshToken = localStorage.getItem('refreshToken')
        const grantType = 'refresh_token'
        return this.httpClient.post<any>(this.baseUrlToken, { userName, refreshToken, grantType }).pipe(
            map(result => {
                if (result && result.authToken.token) {
                    this.setLoginStatus(true)
                    this.setDisplayName(result.authToken.displayName)
                    this.setLocalStorage(result.authToken)
                }
                return <any>result
            })
        )
    }

    private clearLocalStorage() {
        localStorage.removeItem('displayName')
        localStorage.removeItem('expiration')
        localStorage.removeItem('jwt')
        localStorage.removeItem('loginStatus')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('username')
    }

    private navigateToLogin() {
        this.router.navigate(['/login'])
    }

    private checkLoginStatus(): boolean {

        const loginCookie = localStorage.getItem('loginStatus')

        if (loginCookie === '1') {
            if (localStorage.getItem('jwt') !== null || localStorage.getItem('jwt') !== undefined) {
                return true
            }
        }

    }

    private setLoginStatus(status: boolean) {
        this.loginStatus.next(status)
    }

    private setLocalStorage(result) {
        localStorage.setItem('displayName', result.displayName)
        localStorage.setItem('expiration', result.expiration)
        localStorage.setItem('jwt', result.token)
        localStorage.setItem('loginStatus', '1')
        localStorage.setItem('refreshToken', result.refresh_token)
        localStorage.setItem('username', result.username)
    }

    private setDisplayName(name: string) {
        this.displayName.next(name)
    }

    get currentDisplayName() {
        return this.displayName.asObservable()
    }

    get isLoggedIn() {
        return this.loginStatus.asObservable()
    }

}
