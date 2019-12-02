import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class InteractionService {

    private messageSource = new Subject<string>()

    data = this.messageSource.asObservable()

    sendData(message: any) {
        this.messageSource.next(message)
    }

}
