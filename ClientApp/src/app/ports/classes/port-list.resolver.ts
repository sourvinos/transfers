import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Port } from './port';
import { PortService } from './port.service';

@Injectable({ providedIn: 'root' })

export class PortListResolver implements Resolve<Port[]> {

    constructor(private portService: PortService) { }

    resolve(): Observable<Port[]> {
        return this.portService.getAll()
    }

}
