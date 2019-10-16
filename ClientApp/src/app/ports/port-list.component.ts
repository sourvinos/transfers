import { Component, OnInit } from '@angular/core'
import { HttpResponse } from '@angular/common/http'

import { IPort } from './../models/port'
import { PortService } from '../services/port.service'
import { Utils } from '../shared/classes/utils'

@Component({
    selector: 'port-list',
    templateUrl: './port-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class PortListComponent implements OnInit {

    ports: IPort[]
    filteredPorts: IPort[]

    constructor(private service: PortService) { }

    ngOnInit() {
        this.service.getPorts().subscribe(data => this.filteredPorts = this.ports = data, error => Utils.errorLogger(error))
    }

    filter(query: string) {
        this.filteredPorts = query ? this.ports.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.ports
    }

    createPDF() {
        this.service.createPDF().subscribe((file: HttpResponse<Blob>) => {
            window.location.href = file.url
        })
    }
}
