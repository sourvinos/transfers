import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';

@Injectable({ providedIn: 'root' })

export class SnackbarService {

    constructor(public snackBar: MatSnackBar, private zone: NgZone) { }

    public open(message: string | string[], type: string) {
        this.zone.run(() => {
            let errors = ''
            if (typeof (message) === 'object') {
                message.forEach(element => {
                    errors += element + '<br />'
                })
            }
            if (typeof (message) === 'string') {
                errors = message
            }
            this.snackBar.openFromComponent(SnackbarComponent, {
                data: {
                    html: errors
                },
                panelClass: [type],
            })
            // this.snackBar.open(errors, 'Close', {
            //     panelClass: [type],
            // })
        })
    }

}
