// Base
import { Component, OnInit } from '@angular/core'
import { get } from 'scriptjs'
import * as jsPDF from 'jspdf'
// Custom
import { PortService } from '../services/port.service'
import { Utils } from '../shared/classes/utils'
import { IPort } from './../models/port'
import { HttpResponse } from '@angular/common/http'

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
        get('script.js', () => { })
        this.service.getPorts().subscribe(data => this.filteredPorts = this.ports = data, error => Utils.ErrorLogger(error))
    }

    filter(query: string) {
        this.filteredPorts = query ? this.ports.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.ports
    }

    createPDF() {
        this.service.createPDF().subscribe((file: HttpResponse<Blob>) => window.location.href = file.url)
        // fileService.getFile('123').subscribe((file: HttpResponse<Blob>) => window.location.href = file.url);
    }

    // createPDFServer() {
    //     this.service.getPorts().subscribe(data => {
    //         var file = new Blob([data], { type: 'application/pdf' })
    //         var fileURL = URL.createObjectURL(file)
    //     })
    // }

    createPDFClient() {
        const doc = new jsPDF()
        // doc.addFileToVFS('Play-Regular.ttf', '')
        // console.log(doc.getFontList())
        // doc.addFont('Play-Regular.ttf', 'Play-Regular', 'normal')

        // doc.setFont('Play-Regular', 'normal')
        let line = 10

        doc.text('Header', 10, 10)

        this.filteredPorts.forEach((port, index) => {
            line += 10
            // if (line == 280) {
            //     doc.text('Footer', 10, 280)
            //     doc.addPage()
            //     doc.text('Header', 10, 10)
            //     line = 20
            // }
            doc.text('  αβγΑΒΓ   ' + index + ' ' + port.description + '' + line, 10, line)
        })

        doc.text('Footer', 10, 280)

        doc.save('Tsito')

        // let doc = new jsPDF()
        // doc.setFont('Tahoma')
        // this.filteredPorts.forEach(element => {
        //     doc.fromHTML(element.description, 10, 10)
        // })
    }
}
