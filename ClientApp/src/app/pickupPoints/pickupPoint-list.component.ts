import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { IPickupPoint } from '../models/pickupPoint'
import { IRoute } from '../models/route'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'
import { PickupPointService } from '../services/pickupPoint.service'
import { RouteService } from '../services/route.service'
import { Utils } from '../shared/classes/utils'
import { MatTableDataSource } from '@angular/material'
import { SelectionModel } from '@angular/cdk/collections'

@Component({
    selector: 'pickupPoint-list',
    templateUrl: './pickupPoint-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class PickupPointListComponent implements OnInit, OnDestroy {

    // #region Init

    routeId: number

    routes: IRoute[]
    pickupPoints: IPickupPoint[]
    filteredPickupPoints: IPickupPoint[]

    columns = ['id', 'description', 'time']
    fields = ['Id', 'Description', 'Time']
    format = ['', '', '']
    align = ['center', 'left', 'center']

    unlisten: Unlisten

    dataSource: MatTableDataSource<IPickupPoint>
    selection: SelectionModel<[]>

    selectedElement = []

    //#endregion

    constructor(private routeService: RouteService, private pickupPointService: PickupPointService, private keyboardShortcutsService: KeyboardShortcuts, private route: ActivatedRoute, private router: Router) {
        this.unlisten = null
    }

    ngOnInit() {
        this.getAllRoutes()
        this.addShortcuts()
    }

    ngOnDestroy(): void {
        (this.unlisten) && this.unlisten();
    }

    // T
    editRecord() {
        this.router.navigate(['/pickupPoints/', document.querySelector('.mat-row.selected').children[0].textContent])
    }

    // T
    newRecord() {
        this.router.navigate(['/pickupPoints/new'])
    }

    // T
    filter(query: string) {
        this.dataSource.data = query ? this.pickupPoints.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.pickupPoints
    }

    // T
    onRouteChange() {
        this.populatePickupPoints()
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

    private populatePickupPoints() {
        this.pickupPointService.getPickupPoints(this.routeId).subscribe(data => {
            this.pickupPoints = data
            this.filteredPickupPoints = this.pickupPoints
            this.dataSource = new MatTableDataSource<IPickupPoint>(this.filteredPickupPoints)
            this.selection = new SelectionModel<[]>(false)
            this.unlisten = null

        }, error => Utils.errorLogger(error))
    }

    private getAllRoutes() {
        this.routeService.getRoutes().subscribe(data => this.routes = data, error => Utils.errorLogger(error))
    }

}