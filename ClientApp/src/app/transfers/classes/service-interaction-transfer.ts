import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class InteractionTransferService {

    private messageSource = new Subject<string[]>()

    data = this.messageSource.asObservable()

    sendObject(data: any[]) {
        this.messageSource.next(data)
        console.log('inside transfers service', data)
    }

}
