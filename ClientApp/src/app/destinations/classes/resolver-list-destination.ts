import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { IDestination } from './model-destination';
import { DestinationService } from './service-api-destination';

@Injectable({ providedIn: 'root' })

export class DestinationListResolverService implements Resolve<IDestination[]>{

    constructor(private destinationService: DestinationService) { }

    resolve(): Observable<IDestination[]> {
        return this.destinationService.getAll()
    }

}