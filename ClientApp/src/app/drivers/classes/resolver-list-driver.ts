import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Driver } from './model-driver';
import { DriverService } from './service-api-driver';

@Injectable({ providedIn: 'root' })

export class DriverListResolverService implements Resolve<Driver[]>{

    constructor(private driverService: DriverService) { }

    resolve(): Observable<Driver[]> {
        return this.driverService.getAll()
    }

}