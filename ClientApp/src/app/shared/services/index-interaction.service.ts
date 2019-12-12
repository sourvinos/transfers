import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class IndexInteractionService {

    private messageSource = new Subject<string>()

    data = this.messageSource.asObservable()

    sendObject(data: any) {
        this.messageSource.next(data)
    }

}
