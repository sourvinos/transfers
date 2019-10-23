import { HttpResponse } from '@angular/common/http'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'
import { PortService } from '../services/port.service'
import { Utils } from '../shared/classes/utils'
import { IPort } from './../models/port'

@Component({
    selector: 'port-list',
    templateUrl: './port-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class PortListComponent implements OnInit, OnDestroy {

    //#region Init

    ports: IPort[]
    filteredPorts: IPort[]

    unlisten: Unlisten

    //#endregion

    constructor(private service: PortService, private keyboardShortcutsService: KeyboardShortcuts, private router: Router) {
        this.unlisten = null
    }

    ngOnInit() {
        this.getAllPorts()
        this.addShortcuts()
        this.setFocus('searchField')
    }

    ngOnDestroy(): void {
        (this.unlisten) && this.unlisten();
    }

    // T
    filter(query: string) {
        this.filteredPorts = query ? this.ports.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.ports
    }

    // T
    newRecord() {
        this.router.navigate(['/ports/new'])
    }

    // T
    createPDF() {
        this.service.createPDF().subscribe((file: HttpResponse<Blob>) => {
            window.location.href = file.url
        })
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            "Alt.N": (event: KeyboardEvent): void => {
                event.preventDefault()
                document.getElementById('new').click()
            }
        }, {
            priority: 1,
            inputs: true
        })
    }

    private getAllPorts() {
        this.service.getPorts().subscribe(data => this.filteredPorts = this.ports = data, error => Utils.errorLogger(error))
    }

    private setFocus(element: string) {
        Utils.setFocus(element)
    }

}
