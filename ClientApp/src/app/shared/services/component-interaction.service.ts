import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })

export class ComponentInteractionService {

    private emitChangeSource = new Subject<any>();

    changeEmitted = this.emitChangeSource.asObservable();

    emitChange(change: any) {
        this.emitChangeSource.next(change);
    }

    emitFormStatus(change: any) {
        this.emitChangeSource.next(change);
    }

}