// Base
import { Component, OnInit } from '@angular/core';
import { get } from 'scriptjs';
// Custom
import { PortService } from '../services/port.service';
import { Utils } from '../shared/classes/utils';
import { IPort } from './../models/port';

@Component({
    selector: 'port-list',
    templateUrl: './port-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class PortListComponent implements OnInit {

    ports: IPort[];
    filteredPorts: IPort[];

    constructor(private service: PortService) { }

    ngOnInit() {
        get('script.js', () => { });
        this.service.getPorts().subscribe(data => this.filteredPorts = this.ports = data, error => Utils.ErrorLogger(error));
    }

    filter(query: string) {
        this.filteredPorts = query ? this.ports.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.ports;
    }

}
