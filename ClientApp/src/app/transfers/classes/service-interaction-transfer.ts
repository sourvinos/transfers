import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class InteractionTransferService {

    private messageSource = new Subject<string>()

    data = this.messageSource.asObservable()

    sendData(data: any) {
        this.messageSource.next(data)
    }

}
