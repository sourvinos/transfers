import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { DriverService } from '../services/driver.service'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'
import { Utils } from '../shared/classes/utils'
import { IDriver } from './../models/driver'

@Component({
    selector: 'driver-list',
    templateUrl: './driver-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class DriverListComponent implements OnInit, OnDestroy {

    //#region Init

    drivers: IDriver[]
    filteredDrivers: IDriver[]

    unlisten: Unlisten

    // #endregion

    constructor(private service: DriverService, private keyboardShortcutsService: KeyboardShortcuts, private router: Router) {
        this.unlisten = null
    }

    ngOnInit() {
        this.getAllDrivers()
        this.addShortcuts()
        this.setFocus('searchField')
    }

    ngOnDestroy(): void {
        (this.unlisten) && this.unlisten();
    }

    // T
    filter(query: string) {
        this.filteredDrivers = query ? this.drivers.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.drivers
    }

    // T
    newRecord() {
        this.router.navigate(['/drivers/new'])
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

    private getAllDrivers() {
        this.service.getDrivers().subscribe(data => this.filteredDrivers = this.drivers = data, error => Utils.errorLogger(error))
    }

    private setFocus(element: string) {
        Utils.setFocus(element)
    }

}
