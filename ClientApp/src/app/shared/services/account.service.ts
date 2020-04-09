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
    private baseUrlChangePassword = '/api/account/changePassword'

    private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus())
    private displayName = new BehaviorSubject<string>(localStorage.getItem('displayName'))
    private userRole = new BehaviorSubject<string>(localStorage.getItem('userRole'))

    // #endregion

    constructor(private httpClient: HttpClient, private router: Router) { }

    changePassword(currentPassword: string, password: string, confirmPassword: string) {
        return this.httpClient.post<any>(this.baseUrlChangePassword, { currentPassword, password, confirmPassword })
    }

    forgotPassword(email: string) {
        return this.httpClient.post<any>(this.baseUrlForgotPassword, { email })
    }

    login(username: string, password: string) {
        const grantType = 'password'
        return this.httpClient.post<any>(this.baseUrlToken, { username, password, grantType }).pipe(map(response => {
            this.setLoginStatus(true)
            this.setLocalStorage(response)
            this.setUserData()
        }))
    }

    logout() {
        this.setLoginStatus(false)
        this.clearLocalStorage()
        this.navigateToLogin()
    }

    register(username: string, displayName: string, password: string, confirmPassword: string, email: string) {
        return this.httpClient.post<any>(this.baseUrlRegister, { username, displayName, password, confirmPassword, email })
    }

    resetPassword(email: string, password: string, confirmPassword: string, token: string) {
        return this.httpClient.post<any>(this.baseUrlResetPassword, { email, password, confirmPassword, token })
    }

    getNewRefreshToken(): Observable<any> {
        const username = localStorage.getItem('username')
        const refreshToken = localStorage.getItem('refreshToken')
        const grantType = 'refresh_token'
        return this.httpClient.post<any>(this.baseUrlToken, { username, refreshToken, grantType }).pipe(
            map(response => {
                console.log('Refresh token' + response.response.token)
                if (response.response.token) {
                    this.setLoginStatus(true)
                    this.setLocalStorage(response)
                }
                return <any>response
            })
        )
    }

    private checkLoginStatus(): boolean {
        const loginCookie = localStorage.getItem('loginStatus')
        if (loginCookie === '1') {
            if (localStorage.getItem('jwt') !== null || localStorage.getItem('jwt') !== undefined) {
                return true
            }
        }
        return false
    }

    private clearLocalStorage() {
        localStorage.removeItem('displayName')
        localStorage.removeItem('expiration')
        localStorage.removeItem('jwt')
        localStorage.removeItem('loginStatus')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userRole')
        localStorage.removeItem('username')
    }

    private navigateToLogin() {
        this.router.navigate(['/login'])
    }

    private setLoginStatus(status: boolean) {
        this.loginStatus.next(status)
    }

    private setLocalStorage(response: any) {
        localStorage.setItem('displayName', response.response.displayName)
        localStorage.setItem('expiration', response.response.expiration)
        localStorage.setItem('jwt', response.response.token)
        localStorage.setItem('loginStatus', '1')
        localStorage.setItem('refreshToken', response.response.refresh_token)
        localStorage.setItem('userRole', response.response.roles)
        localStorage.setItem('username', response.response.username)
    }

    private setUserData() {
        this.displayName.next(localStorage.getItem('displayName'));
        this.userRole.next(localStorage.getItem('userRole'));
    }

    //#region Getters

    get currentDisplayName() {
        return this.displayName.asObservable()
    }

    get isLoggedIn() {
        return this.loginStatus.asObservable()
    }

    //#endregion

}
