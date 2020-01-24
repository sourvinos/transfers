import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Port } from './model-port';
import { PortService } from './service-api-port';

@Injectable({ providedIn: 'root' })

export class PortListResolverService implements Resolve<Port[]>{

    constructor(private portService: PortService) { }

    resolve(): Observable<Port[]> {
        return this.portService.getAll()
    }

}