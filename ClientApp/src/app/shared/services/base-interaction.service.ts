import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class BaseInteractionService {

    _record = new Subject<string[]>()
    _action = new Subject<string>()
    _checked = new Subject<number>()
    _refreshList = new Subject<any>()
    _transfers = new Subject<any[]>()

    record = this._record.asObservable()
    action = this._action.asObservable()
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

}
