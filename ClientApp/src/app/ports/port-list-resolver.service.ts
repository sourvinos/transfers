import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IPort } from '../models/port';
import { PortService } from '../services/port.service';

@Injectable({ providedIn: 'root' })

export class PortListResolverService implements Resolve<IPort[]>{

    constructor(private portService: PortService) { }

    resolve(): Observable<IPort[]> {
        return this.portService.getPorts().pipe(delay(100))
    }

}