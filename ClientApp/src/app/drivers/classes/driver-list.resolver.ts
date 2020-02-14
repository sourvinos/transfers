import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Driver } from './driver';
import { DriverService } from './driver.service';

@Injectable({ providedIn: 'root' })

export class DriverListResolver implements Resolve<Driver[]> {

    constructor(private driverService: DriverService) { }

    resolve(): Observable<Driver[]> {
        return this.driverService.getAll()
    }

}
