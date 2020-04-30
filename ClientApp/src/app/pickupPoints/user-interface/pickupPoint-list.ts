import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject, Observable } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { RouteService } from 'src/app/routes/classes/route.service'
import { Utils } from 'src/app/shared/classes/utils'
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { PickupPointFlat } from '../classes/pickupPointFlat'
import { Route } from 'src/app/routes/classes/route'

@Component({
    selector: 'pickuppoint-list',
    templateUrl: './pickupPoint-list.html',
    styleUrls: ['../../shared/styles/lists.css', './pickupPoint-list.css']
})

export class PickupPointListComponent implements OnInit, OnDestroy {

    queryResult: any = {}
    queryResultClone: any = {}
    flatRecords: PickupPointFlat[] = []
    flatFilteredRecords: PickupPointFlat[] = []
    url = '/pickupPoints'
    resolver = 'pickupPointList'
    routeResolver = 'routeList'
    routes: Route[]

    headers = ['Id', 'Route', 'Description', 'Exact point', 'Time']
    widths = ['0px', '10%', '40%', '40%', '10%']
    visibility = ['none', '', '', '', '']
    justify = ['center', 'center', 'left', 'left', 'center']
    fields = ['id', 'routeDescription', 'description', 'exactPoint', 'time']

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    constructor(private activatedRoute: ActivatedRoute, private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private baseInteractionService: BaseInteractionService, private buttonClickService: ButtonClickService, private routeService: RouteService) {
        this.loadRecords()
    }

    ngOnInit() {
        this.addShortcuts()
        this.loadRoutes()
        this.subscribeToInteractionService()
        this.flattenResults()
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    onFilter(query: string) {
        this.flatFilteredRecords = query ? this.flatRecords.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.flatRecords
    }

    onNew() {
        this.router.navigate([this.url + '/new'])
    }

    private editRecord(id: number) {
        this.router.navigate([this.url, id])
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': (event: KeyboardEvent): void => {
                this.onGoBack()
            },
            'Alt.F': (event: KeyboardEvent): void => {
                this.focus(event, 'searchField')
            },
            'Alt.N': (event: KeyboardEvent): void => {
                this.buttonClickService.clickOnButton(event, 'new')
            }
        }, {
            priority: 0,
            inputs: true
        })
    }

    private flattenResults() {
        this.flatRecords.splice(0)
        for (const {
            id: a,
            route: { description: b },
            description: c,
            exactPoint: d,
            time: e,
        } of this.queryResult) {
            this.flatRecords.push({ id: a, routeDescription: b, description: c, exactPoint: d, time: e })
        }
        this.flatFilteredRecords = this.flatRecords
    }

    private focus(event: KeyboardEvent, element: string) {
        event.preventDefault()
        Utils.setFocus(element)
    }

    private onGoBack() {
        this.router.navigate(['/'])
    }

    private loadRecords() {
        this.queryResult = this.activatedRoute.snapshot.data[this.resolver]
    }

    private loadRoutes() {
        this.routeService.getAll().subscribe(results => {
            this.routes = results
        })
    }

    private subscribeToInteractionService() {
        this.baseInteractionService.record.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.editRecord(response['id'])
        })
    }

}
