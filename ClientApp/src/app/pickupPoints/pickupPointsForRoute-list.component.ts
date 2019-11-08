import { SelectionModel } from '@angular/cdk/collections';
import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { IPickupPoint } from '../models/pickupPoint';
import { IRoute } from '../models/route';
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service';

@Component({
    selector: 'app-pickupPointsForRoute-list',
    templateUrl: './pickupPointsForRoute-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class PickupPointsForRouteListComponent implements OnInit, OnDestroy, DoCheck {

    // #region Init

    routeId: number
    currentRouteId: number

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

    showLoadingIndication: boolean = true

    // #endregion

    constructor(private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private activatedRoute: ActivatedRoute) {
        this.activatedRoute.params.subscribe(p => (this.routeId = p['id']))
        this.currentRouteId = this.routeId
        this.unlisten = null
    }

    ngOnInit() {
        this.getRouteSnapshot()
        this.showLoadingIndicator()
        this.updateMaterialTable()
        this.addShortcuts()
    }

    ngDoCheck() {
        if (this.routeId != this.currentRouteId) {
            this.getRouteSnapshot()
            this.updateWorkingVariables()
            this.updateMaterialTable()
            this.showLoadingIndicator()
        }
    }

    ngOnDestroy() {
        (this.unlisten) && this.unlisten();
    }

    // T
    editRecord() {
        this.router.navigate(['/pickupPoints/', document.querySelector('.mat-row.selected').children[0].textContent])
        // this.router.navigateByUrl('/pickupPoints/1692', { state: { hello: 'world' } })
    }

    // T
    newRecord() {
        this.router.navigate(['/pickupPoints/new'])
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

    private getRouteSnapshot() {
        this.pickupPoints = this.activatedRoute.snapshot.data['pickupPointList']
    }

    private showLoadingIndicator() {
        this.router.events.subscribe((routerEvent) => {
            if (routerEvent instanceof NavigationStart) {
                this.showLoadingIndication = true
            }
            if (routerEvent instanceof NavigationEnd || routerEvent instanceof NavigationCancel || routerEvent instanceof NavigationError) {
                this.showLoadingIndication = false
            }
        })
    }

    private updateMaterialTable() {
        this.dataSource = new MatTableDataSource<IPickupPoint>(this.pickupPoints)
        this.selection = new SelectionModel<[]>(false)
    }

    private updateWorkingVariables() {
        this.currentRouteId = this.routeId
    }

}