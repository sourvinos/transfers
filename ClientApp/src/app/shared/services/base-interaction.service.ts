import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class BaseInteractionService {

    _record = new Subject<string[]>()
    _recordStatus = new Subject<string>()
    _action = new Subject<string>()
    _hasTableData = new Subject<boolean>()
    _checked = new Subject<number>()
    _refreshList = new Subject<any>()
    _transfers = new Subject<any[]>()

    record = this._record.asObservable()
    recordStatus = this._recordStatus.asObservable()
    action = this._action.asObservable()
    hasTableData = this._hasTableData.asObservable()
    checked = this._checked.asObservable()
    refreshList = this._refreshList.asObservable()
    transfers = this._transfers.asObservable()

    sendRecords(records: any[]) {
        this._transfers.next(records)
    }

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

    /**
     * Caller(s):
     *  form-transfer.ts
     * 
     * Subscribers(s):
     *  list-transfer.ts
     * 
     * Description:
     *  The caller tells the list to refresh when a record is saved
     */
    mustRefreshList() {
        this._refreshList.next()
    }

    /**
     * Caller(s):
     *  list-transfer.ts
     *  table-transfer.ts
     * 
     * Subscriber(s):
     *  list-transfer.ts
     * 
     * Description:
     *  The callers send the sum of checked persons so that the subscriber can display it
     * 
     * @param total 
     */
    setCheckedTotalPersons(total: number) {
        this._checked.next(total)
    }

    /**
     * Caller(s):
     *  list-transfer.ts
     * 
     * Subscriber(s):
     *  wrapper-transfer.ts
     * 
     * Description:
     *  The caller sends true or false according to the persons count so that the subscriber can display the 'Assign driver' button
     * 
     * @param records 
     */
    setTableStatus(records: boolean) {
        this._hasTableData.next(records)
    }

}
