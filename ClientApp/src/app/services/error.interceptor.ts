import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { MatDialog, MatSnackBar } from '@angular/material'
import { DialogAlertComponent } from '../shared/components/dialog-alert/dialog-alert.component'

@Injectable({ providedIn: 'root' })

export class ErrorInterceptor implements HttpInterceptor {

    constructor(public dialog: MatDialog, private snackBar: MatSnackBar) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(this.handleError))
    }

    private handleError(errorResponse: HttpErrorResponse) {
        console.log('ERROR', errorResponse.status)
        if (errorResponse.status == 500) {
            alert('The record is in use')
        }
        if (errorResponse.status == 404) {
            alert('The record was not found')
        }
        return throwError('OOPS')
    }

}
