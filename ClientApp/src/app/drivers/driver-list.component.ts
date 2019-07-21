import { Component, OnInit } from '@angular/core';
import { get } from 'scriptjs';

import { IDriver } from './../models/driver';
import { Utils } from '../shared/classes/utils';
import { DriverService } from '../services/driver.service';

@Component({
    selector: 'driver-list',
    templateUrl: './driver-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class DriverListComponent implements OnInit {

    drivers: IDriver[];
    filteredDrivers: IDriver[];

    constructor(private service: DriverService) { }

    ngOnInit() {
        get('script.js', () => { });
        this.service.getDrivers().subscribe(data => this.filteredDrivers = this.drivers = data, error => Utils.ErrorLogger(error));
    }

    filter(query: string) {
        this.filteredDrivers = query ? this.drivers.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.drivers;
    }

}
