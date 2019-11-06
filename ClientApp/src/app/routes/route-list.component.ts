import { SelectionModel } from '@angular/cdk/collections'
import { HttpResponse } from '@angular/common/http'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatTableDataSource } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
import { IRoute } from '../models/route'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'
import { PortService } from '../services/port.service'
import { Utils } from '../shared/classes/utils'

@Component({
    selector: 'route-list',
    templateUrl: './route-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class RouteListComponent implements OnInit, OnDestroy {

    // #region Init

    routes: IRoute[]
    filteredRoutes: IRoute[]

    columns = ['id', 'description']
    fields = ['Id', 'Description']
    format = ['', '']
    align = ['center', 'left']

    unlisten: Unlisten

    dataSource: MatTableDataSource<IRoute>
    selection: SelectionModel<[]>

    selectedElement = []

    // #endregion

    constructor(private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private route: ActivatedRoute, private portService: PortService) {
        this.routes = this.route.snapshot.data['routeList']
        this.filteredRoutes = this.routes
        this.dataSource = new MatTableDataSource<IRoute>(this.filteredRoutes)
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
        this.router.navigate(['/routes/', document.querySelector('.mat-row.selected').children[0].textContent])
    }

    // T
    newRecord() {
        this.router.navigate(['/routes/new'])
    }

    // T
    filter(query: string) {
        this.dataSource.data = query ? this.routes.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.routes
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
