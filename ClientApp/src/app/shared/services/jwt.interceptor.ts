import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, throwError } from 'rxjs'
import { catchError, filter, finalize, switchMap, take, tap } from 'rxjs/operators'
import { AccountService } from './account.service'

@Injectable({ providedIn: 'root' })

export class JwtInterceptor implements HttpInterceptor {

    private isTokenRefreshing = false;
    private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(private accountService: AccountService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.isUserLoggedIn()) {
            return next.handle(this.attachTokenToRequest(request)).pipe(
                tap((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) { }
                }), catchError((err): Observable<any> => {
                    if (this.isUserLoggedIn()) {
                        if (err instanceof HttpErrorResponse) {
                            switch ((<HttpErrorResponse>err).status) {
                                case 400:
                                    return throwError(err.error.response)
                                case 404:
                                    return throwError(this.handleError)
                                case 401:
                                    console.log('Token expired, attempting refresh')
                                    return this.handleHttpErrorResponse(request, next)
                            }
                        } else {
                            return throwError(this.handleError)
                        }
                    }
                })
            )
        } else {
            return next.handle(request)
        }
    }

    private handleHttpErrorResponse(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isTokenRefreshing) {
            this.isTokenRefreshing = true
            this.tokenSubject.next(null)
            return this.accountService.getNewRefreshToken().pipe(
                switchMap((tokenresponse: any) => {
                    if (tokenresponse) {
                        this.tokenSubject.next(tokenresponse.response.token)
                        localStorage.setItem('loginStatus', '1')
                        localStorage.setItem('jwt', tokenresponse.response.token)
                        localStorage.setItem('userId', tokenresponse.response.userId)
                        localStorage.setItem('displayName', tokenresponse.response.displayName)
                        localStorage.setItem('expiration', tokenresponse.response.expiration)
                        localStorage.setItem('userRole', tokenresponse.response.roles)
                        localStorage.setItem('refreshToken', tokenresponse.response.refresh_token)
                        console.log('Token refreshed')
                        return next.handle(this.attachTokenToRequest(request))
                    }
                    return <any>this.accountService.logout()
                }),
                catchError(error => {
                    this.accountService.logout()
                    return this.handleError(error)
                }),
                finalize(() => {
                    this.isTokenRefreshing = false
                })
            )
        } else {
            this.isTokenRefreshing = false
            return this.tokenSubject.pipe(filter(token => token != null), take(1), switchMap(() => next.handle(this.attachTokenToRequest(request))))
        }
    }

    private attachTokenToRequest(request: HttpRequest<any>) {
        const token = localStorage.getItem('jwt');
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    private handleError(errorResponse: HttpErrorResponse) {
        if (errorResponse.error instanceof Error) {
            return `Front-end error ${errorResponse.error.message}`
        } else {
            return `Server error ${errorResponse.status} ${errorResponse.error}`
        }
    }

    private isUserLoggedIn() {
        return localStorage.getItem('loginStatus') === '1'
    }

}
