import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, throwError } from 'rxjs'
import { catchError, filter, finalize, switchMap, take, tap } from 'rxjs/operators'
import { AccountService } from './account.service'

@Injectable({ providedIn: 'root' })

export class JwtInterceptor implements HttpInterceptor {

    private isTokenRefreshing = false
    private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null)

    constructor(private accountService: AccountService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(this.attachTokenToRequest(request)).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) { }
        }),
            catchError((err): Observable<any> => {
                if (this.isUserLoggedIn()) {
                    if (err instanceof HttpErrorResponse) {
                        switch ((<HttpErrorResponse>err).status) {
                            case 400:
                                return <any>this.accountService.logout()
                            case 401:
                                return this.handleHttpResponseError(request, next)
                        }
                    } else {
                        return throwError(this.handleError)
                    }
                }
            })
        )
    }

    private attachTokenToRequest(request: HttpRequest<any>) {
        const token = localStorage.getItem('jwt')
        const req = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        return req
    }

    private isUserLoggedIn() {
        return localStorage.getItem('loginStatus') === '1'
    }

    private handleHttpResponseError(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isTokenRefreshing) {
            this.isTokenRefreshing = true
            this.tokenSubject.next(null)
            return this.accountService.getNewRefreshToken().pipe(
                switchMap((tokenresponse: any) => {
                    if (tokenresponse) {
                        this.tokenSubject.next(tokenresponse.authToken.token)
                        localStorage.setItem('loginStatus', '1')
                        localStorage.setItem('jwt', tokenresponse.authToken.token)
                        localStorage.setItem('userName', tokenresponse.authToken.userName)
                        localStorage.setItem('displayName', tokenresponse.authToken.displayName)
                        localStorage.setItem('expiration', tokenresponse.authToken.expiration)
                        localStorage.setItem('userRole', tokenresponse.authToken.roles)
                        localStorage.setItem('refreshToken', tokenresponse.authToken.refresh_token)
                        return next.handle(this.attachTokenToRequest(request))
                    }
                    return <any>this.accountService.logout()
                }),
                catchError(err => {
                    this.accountService.logout()
                    return this.handleError(err)
                }),
                finalize(() => {
                    this.isTokenRefreshing = false
                })
            )
        } else {
            this.isTokenRefreshing = false
            return this.tokenSubject.pipe(filter(token => token != null), take(1), switchMap(token => next.handle(this.attachTokenToRequest(request))))
        }
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMsg: string
        if (errorResponse.error instanceof Error) {
            errorMsg = 'An error occured :' + errorResponse.error.message
        } else {
            errorMsg = `Backend returned code ${errorResponse.status}, body was: ${errorResponse.error}`
        }
        return throwError(errorMsg)
    }


}
