import { HttpResponse } from '@angular/common/http'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'
import { PortService } from '../services/port.service'
import { Utils } from '../shared/classes/utils'
import { IPort } from './../models/port'
import { MatTableDataSource } from '@angular/material'
import { SelectionModel } from '@angular/cdk/collections'

@Component({
    selector: 'port-list',
    templateUrl: './port-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class PortListComponent implements OnInit, OnDestroy {

    // #region Init

    ports: IPort[]
    filteredPorts: IPort[]

    columns = ['id', 'description']
    fields = ['Id', 'Description']
    format = ['', '']
    align = ['center', 'left']

    unlisten: Unlisten

    dataSource: MatTableDataSource<IPort>
    selection: SelectionModel<[]>

    selectedElement = []

    // #endregion

    constructor(private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private route: ActivatedRoute, private portService: PortService) {
        this.ports = this.route.snapshot.data['portList']
        this.filteredPorts = this.ports
        this.dataSource = new MatTableDataSource<IPort>(this.filteredPorts)
        this.selection = new SelectionModel<[]>(false)
        this.unlisten = null
    }

    ngOnInit() {
        this.addShortcuts()
        this.setFocus('searchField')
    }

    ngOnDestroy(): void {
        (this.unlisten) && this.unlisten();
    }

    // T
    editRecord() {
        this.router.navigate(['/ports/', document.querySelector('.mat-row.selected').children[0].textContent])
    }

    // T
    newRecord() {
        this.router.navigate(['/ports/new'])
    }

    // T
    filter(query: string) {
        this.dataSource.data = query ? this.ports.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.ports
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            "Enter": (event: KeyboardEvent): void => {
                this.editRecord()
            },
            "Alt.N": (event: KeyboardEvent): void => {
                event.preventDefault()
                document.getElementById('new').click()
            }
        }, {
            priority: 1,
            inputs: true
        })
    }

    private setFocus(element: string) {
        Utils.setFocus(element)
    }

    // T
    createPDF() {
        this.portService.createPDF().subscribe((file: HttpResponse<Blob>) => {
            window.location.href = file.url
        })
    }

}
