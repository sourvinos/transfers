import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class InteractionTransferService {

    private messageSource = new Subject<string[]>()
    private _recordStatus = new Subject<string>()
    private _action = new Subject<string>()

    data = this.messageSource.asObservable()
    recordStatus = this._recordStatus.asObservable()
    action = this._action.asObservable()

    sendObject(data: any[]) {
        this.messageSource.next(data)
        console.log('inside transfers service', data)
    }

    performAction(action: string) {
        this._action.next(action)
    }

    /**
     * Caller(s):
     *  form-transfer.ts
     * 
     * Subscriber(s):
     *  wrapper-transfer.ts
     * 
     * Description:
     *  The caller sends 'empty', 'newRecord' or 'editRecord' to the 'recordStatus'
     *  The wrapper subscribes to the 'recordStatus', checks the value and displays the buttons:
     *   recordStatus = 'empty' displays 'New'
     *   recordStatus = 'newRecord' displays 'Save'
     *   recordStatus = 'editRecord' displays 'Delete' and 'Save' 
     * 
     * @param status 
     */
    setRecordStatus(status: string) {
        this._recordStatus.next(status)
    }

}
