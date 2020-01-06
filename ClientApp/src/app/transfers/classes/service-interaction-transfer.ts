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
     *  table-transfer.ts
     * 
     * Subscriber(s):
     *  list-transfer.ts
     * 
     * Description
     *  The caller sends the selected record to the 'record' property
     *  The subscriber executes 'editRecord'
     * 
     * @param record 
     */
    sendObject(record: any) {
        this._record.next(record)
    }

    /**
     * Callers(s):
     *  wrapper-transfer.ts
     * 
     * Subscriber(s):
     *  form-transfer.ts
     * 
     * Description:
     *  The caller sends 'saveRecord' or 'deleteRecord' to the 'action' property
     *  The subscriber checks the value and deletes or saves the record
     * 
     * @param action 
     */
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
     *  The caller sends 'empty', 'newRecord' or 'editRecord' to the 'recordStatus' property
     *  The subscriber checks the value and displays the buttons:
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
