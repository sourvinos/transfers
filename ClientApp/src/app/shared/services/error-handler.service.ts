import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http'

@Injectable({ providedIn: 'root' })

export class ErrorService implements ErrorHandler {

    constructor() { }

    handleError(error: any) {

        if (Error instanceof HttpErrorResponse) {
            console.log(error.status);
        }
        else {
            console.error("an error occurred here broo");
        }

    }
}