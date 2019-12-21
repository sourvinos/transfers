import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class InteractionTransferService {

    private messageSource = new Subject<string[]>()
    private _recordStatus = new Subject<string>()

    data = this.messageSource.asObservable()
    recordStatus = this._recordStatus.asObservable()

    sendObject(data: any[]) {
        this.messageSource.next(data)
        console.log('inside transfers service', data)
    }

    /**
     * Caller(s):
     *  form-transfer.ts
     * 
     * Subscriber(s):
     *  wrapper-transfer.ts
     * 
     * Description:
     *  The caller sets the local variable to 'empty', 'newRecord' or 'editRecord'
     *  The wrapper subscribes to the _recordStatus, checks the value and displays the buttons:
     *   _recordStatus = 'empty' displays 'New'
     *   _recordStatus = 'newRecord' displays 'Save'
     *   _recordStatus = 'editRecord' displays 'Delete' and 'Save' 
     * 
     * @param status 
     */
    setRecordStatus(status: any) {
        this._recordStatus.next(status)
    }

}
