import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { IPickupPoint } from '../models/pickupPoint'
import { IRoute } from '../models/route'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'
import { PickupPointService } from '../services/pickupPoint.service'
import { RouteService } from '../services/route.service'
import { Utils } from '../shared/classes/utils'

declare var $: any

@Component({
    selector: 'pickupPoint-list',
    templateUrl: './pickupPoint-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class PickupPointListComponent implements OnInit, OnDestroy {

    //#region Init

    routeId: number

    routes: IRoute[]
    pickupPoints: IPickupPoint[]

    unlisten: Unlisten

    //#endregion

    constructor(private routeService: RouteService, private pickupPointService: PickupPointService, private keyboardShortcutsService: KeyboardShortcuts, private router: Router) {
        this.unlisten = null
    }

    ngOnInit() {
        this.getAllRoutes()
        this.addShortcuts()
    }

    ngAfterViewInit() {
        $('.ui.dropdown').dropdown()
    }

    ngOnDestroy(): void {
        (this.unlisten) && this.unlisten();
    }

    // T
    onRouteChange() {
        this.populatePickupPoints()
    }

    // T
    newRecord() {
        this.router.navigate(['/pickupPoints/new'])
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

    private populatePickupPoints() {
        this.pickupPointService.getPickupPoints(this.routeId).subscribe(data => this.pickupPoints = data, error => Utils.errorLogger(error))
    }

    private getAllRoutes() {
        this.routeService.getRoutes().subscribe(data => this.routes = data, error => Utils.errorLogger(error))
    }

}