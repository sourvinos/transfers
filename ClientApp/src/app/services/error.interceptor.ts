import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { SnackbarService } from './snackbar.service'

@Injectable({ providedIn: 'root' })

export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private snackbarService: SnackbarService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const req = request.clone();
        return next.handle(req).pipe(
            catchError(response => {
                switch (response.status) {
                    case 400: this.snackbarService.open('This was a bad request.', 'error'); break
                    case 401: this.snackbarService.open('These credentials are invalid.', 'error'); break
                    case 403: this.snackbarService.open('This email already exists.', 'error'); break
                    case 404: this.snackbarService.open('This record was not found', 'error'); break
                    case 500: this.snackbarService.open('This record is in use and can not be deleted', 'error'); break
                    default: this.snackbarService.open('There is no connection with the server', 'error')
                }
                return throwError(response)
            })
        )
    }

}
