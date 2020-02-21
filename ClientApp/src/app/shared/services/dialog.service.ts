import { Injectable } from '@angular/core'
import { MatDialog } from '@angular/material'
import { Observable } from 'rxjs'
import { DialogAlertComponent } from '../components/dialog-alert/dialog-alert.component'

@Injectable({ providedIn: 'root' })

export class DialogService {

    response: any

    constructor(public dialog: MatDialog) { }

    public open(title: string, titleColor: string, message: string, actions: string[]): Observable<boolean> {
        this.response = this.dialog.open(DialogAlertComponent, {
            height: '300px',
            width: '550px',
            data: {
                title: title,
                titleColor: titleColor,
                message: message,
                actions: actions
            },
            panelClass: 'dialog'
        })
        return this.response.afterClosed()
    }

}
