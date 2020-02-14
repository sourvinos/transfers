import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Destination } from './destination';
import { DestinationService } from './destination.service';

@Injectable({ providedIn: 'root' })

export class DestinationListResolver implements Resolve<Destination[]> {

    constructor(private destinationService: DestinationService) { }

    resolve(): Observable<Destination[]> {
        return this.destinationService.getAll()
    }

}
