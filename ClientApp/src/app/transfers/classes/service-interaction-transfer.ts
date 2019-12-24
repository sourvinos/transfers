import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class InteractionTransferService {

    private _record = new Subject<string[]>()
    private _recordStatus = new Subject<string>()
    private _action = new Subject<string>()

    record = this._record.asObservable()
    recordStatus = this._recordStatus.asObservable()
    action = this._action.asObservable()

    /**
     * Caller(s):
     *  Class - table-transfer
     * 
     * Description
     *  Gets the record from the class and sends it to the parent (list-transfer - subscriber) so it can call the editRecord method
     * 
     * @param record 
     */
    sendObject(record: any) {
        this._record.next(record)
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
