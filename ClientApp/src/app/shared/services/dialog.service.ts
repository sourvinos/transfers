import { Injectable, NgZone } from '@angular/core'
import { Observable, of } from 'rxjs'
import { MatDialog } from '@angular/material'
import { DialogAlertComponent } from '../components/dialog-alert/dialog-alert.component'
import { FormGroup, FormBuilder } from '@angular/forms'

@Injectable({ providedIn: 'root' })

export class DialogService {

    response: any

    constructor(public dialog: MatDialog) { }

    public open(title: string, titleColor: string, message: string): Observable<boolean> {
        this.response = this.dialog.open(DialogAlertComponent, {
            height: '250px',
            width: '550px',
            data: {
                title: title,
                titleColor: titleColor,
                message: message,
                actions: ['cancel', 'ok']
            },
            panelClass: 'dialog'
        })
        return this.response.afterClosed()
    }

}
