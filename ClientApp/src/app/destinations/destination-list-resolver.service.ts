import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IDestination } from '../models/destination';
import { DestinationService } from '../services/destination.service';

@Injectable({ providedIn: 'root' })

export class DestinationListResolverService implements Resolve<IDestination[]>{

    constructor(private destinationService: DestinationService) { }

    resolve(): Observable<IDestination[]> {
        return this.destinationService.getDestinations().pipe(delay(100))
    }

}