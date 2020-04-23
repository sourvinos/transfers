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
                    if (event instanceof HttpResponse) {
                        // console.log('User is logged in, token is valid')
                    }
                }), catchError((err): Observable<any> => {
                    if (this.isUserLoggedIn()) {
                        // console.log('User is logged in, catching error')
                        if (err instanceof HttpErrorResponse) {
                            switch ((<HttpErrorResponse>err).status) {
                                case 404:
                                    // console.log('404 catch')
                                    return throwError(this.handleError)
                                // return next.handle(request) // Returns 401 and goes back to the calling function to execute .catch(...)
                                // return this.handleHttpErrorResponse(request, next) // Logs the user out
                                // return throwError('')
                                // return next.handle(request)
                                case 401:
                                    // console.log('Token expired, attempting refresh')
                                    return this.handleHttpErrorResponse(request, next)
                                default:
                                    return next.handle(request)
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
        // console.log('User is not authorized')
        if (!this.isTokenRefreshing) {
            // console.log('Token is not refreshing, continue')
            this.isTokenRefreshing = true
            this.tokenSubject.next(null)
            return this.accountService.getNewRefreshToken().pipe(
                switchMap((tokenresponse: any) => {
                    // console.log('New refresh token ' + tokenresponse.response)
                    if (tokenresponse) {
                        this.tokenSubject.next(tokenresponse.response.token)
                        localStorage.setItem('loginStatus', '1')
                        localStorage.setItem('jwt', tokenresponse.response.token)
                        localStorage.setItem('username', tokenresponse.response.username)
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
        // console.log('Attaching token to request')
        // console.log(token)
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
