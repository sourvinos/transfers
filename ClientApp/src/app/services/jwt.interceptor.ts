// Base
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take, tap } from 'rxjs/operators';
// Custom
import { AccountService } from './account.service';

@Injectable({ providedIn: 'root' })

export class JwtInterceptor implements HttpInterceptor {

    // Variables
    private isTokenRefreshing: boolean = false;
    private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    // Constructor
    constructor(private acct: AccountService) { }

    // Method
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(this.attachTokenToRequest(request)).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) { }
        }),
            catchError((err): Observable<any> => {
                if (err instanceof HttpErrorResponse) {
                    switch ((<HttpErrorResponse>err).status) {
                        case 400:
                            return <any>this.acct.logout();
                        case 401:
                            console.log("Token expired. Attempting refresh ...");
                            return this.handleHttpResponseError(request, next);
                    }
                } else {
                    return throwError(this.handleError);
                }
            })
        );

    }

    // Private method
    private attachTokenToRequest(request: HttpRequest<any>) {

        var token = localStorage.getItem('jwt');
        return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

    }

    // Private method
    private handleError(errorResponse: HttpErrorResponse) {

        let errorMsg: string;

        if (errorResponse.error instanceof Error) {
            errorMsg = "An error occured :" + errorResponse.error.message;
        } else {
            errorMsg = `Backend returned code ${errorResponse.status}, body was: ${errorResponse.error}`;
        }

        return throwError(errorMsg);
    }

    // Private method
    private handleHttpResponseError(request: HttpRequest<any>, next: HttpHandler) {

        if (!this.isTokenRefreshing) {
            this.isTokenRefreshing = true;
            this.tokenSubject.next(null);
            return this.acct.getNewRefreshToken().pipe(
                switchMap((tokenresponse: any) => {
                    if (tokenresponse) {
                        this.tokenSubject.next(tokenresponse.authToken.token);
                        localStorage.setItem('loginStatus', '1');
                        localStorage.setItem('jwt', tokenresponse.authToken.token);
                        localStorage.setItem('username', tokenresponse.authToken.username);
                        localStorage.setItem('expiration', tokenresponse.authToken.expiration);
                        localStorage.setItem('userRole', tokenresponse.authToken.roles);
                        localStorage.setItem('refreshToken', tokenresponse.authToken.refresh_token);
                        console.log("Token refreshed...");
                        return next.handle(this.attachTokenToRequest(request));
                    }
                    return <any>this.acct.logout();
                }),
                catchError(err => {
                    this.acct.logout();
                    return this.handleError(err);
                }),
                finalize(() => {
                    this.isTokenRefreshing = false;
                })
            );

        }
        else {
            this.isTokenRefreshing = false;
            return this.tokenSubject.pipe(filter(token => token !== null), take(1), switchMap(token => { return next.handle(this.attachTokenToRequest(request)); }));
        }

    }

}