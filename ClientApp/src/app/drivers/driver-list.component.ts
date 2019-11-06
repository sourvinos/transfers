import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'
import { Utils } from '../shared/classes/utils'
import { IDriver } from './../models/driver'
import { MatTableDataSource } from '@angular/material'
import { SelectionModel } from '@angular/cdk/collections'

@Component({
    selector: 'driver-list',
    templateUrl: './driver-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class DriverListComponent implements OnInit, OnDestroy {

    // #region Init

    drivers: IDriver[]
    filteredDrivers: IDriver[]

    columns = ['id', 'description', 'phone']
    fields = ['Id', 'Description', 'Phone']
    format = ['', '', '']
    align = ['center', 'left', 'left']

    unlisten: Unlisten

    dataSource: MatTableDataSource<IDriver>
    selection: SelectionModel<[]>

    selectedElement = []

    // #endregion

    constructor(private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private route: ActivatedRoute) {
        this.drivers = this.route.snapshot.data['driverList']
        this.filteredDrivers = this.drivers
        this.dataSource = new MatTableDataSource<IDriver>(this.filteredDrivers)
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
    filter(query: string) {
        this.dataSource.data = query ? this.drivers.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.drivers
    }

    // T
    newRecord() {
        this.router.navigate(['/drivers/new'])
    }

    // T
    editRecord() {
        this.router.navigate(['/drivers/', document.querySelector('.mat-row.selected').children[0].textContent])
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

}
