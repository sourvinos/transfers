import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Destination } from './model-destination';
import { DestinationService } from './service-api-destination';

@Injectable({ providedIn: 'root' })

export class DestinationListResolverService implements Resolve<Destination[]>{

    constructor(private destinationService: DestinationService) { }

    resolve(): Observable<Destination[]> {
        return this.destinationService.getAll()
    }

}