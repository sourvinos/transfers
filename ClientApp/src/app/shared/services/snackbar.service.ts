import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({ providedIn: 'root' })

export class SnackbarService {

    constructor(public snackBar: MatSnackBar, private zone: NgZone) { }

    public open(message: string, type: string) {
        this.zone.run(() => {
            this.snackBar.open(message, 'Close', {
                panelClass: [type],
            })
        })
    }

}
