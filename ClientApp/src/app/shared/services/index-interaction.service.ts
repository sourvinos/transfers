import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class IndexInteractionService {

    private _data = new Subject<object>()
    private _dialogMustClose = new Subject<boolean>()

    data = this._data.asObservable()
    dialogMustClose = this._dialogMustClose.asObservable()

    sendObject(data: any) {
        this._data.next(data)
    }

    action(action: boolean) {
        this._dialogMustClose.next(action)
    }

}
