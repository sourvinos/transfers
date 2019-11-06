import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IDriver } from '../models/driver';
import { DriverService } from './../services/driver.service';

@Injectable({ providedIn: 'root' })

export class DriverListResolverService implements Resolve<IDriver[]>{

    constructor(private driverService: DriverService) { }

    resolve(): Observable<IDriver[]> {
        return this.driverService.getDrivers().pipe(delay(100))
    }

}