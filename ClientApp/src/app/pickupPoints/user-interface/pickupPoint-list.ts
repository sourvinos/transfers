import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { Utils } from 'src/app/shared/classes/utils'
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { PickupPoint } from '../classes/pickupPoint'
import { PickupPointFlat } from '../classes/pickupPointFlat'

@Component({
    selector: 'pickuppoint-list',
    templateUrl: './pickupPoint-list.html',
    styleUrls: ['../../shared/styles/lists.css']
})

export class PickupPointListComponent implements OnInit, OnDestroy {

    queryResult: any = {}
    queryResultClone: any = {}
    records: PickupPoint[]
    flatRecords: PickupPointFlat[] = []
    flatFilteredRecords: PickupPointFlat[] = []
    // pickupPointsFlat: PickupPointFlat[] = []
    url = '/pickupPoints'
    resolver = 'pickupPointList'

    headers = ['Id', 'Route', 'Description', 'Exact point', 'Time']
    widths = ['0px', '10%', '40%', '40%', '10%']
    visibility = ['none', '', '', '', '']
    justify = ['center', 'center', 'left', 'left', 'center']
    fields = ['id', 'route', 'description', 'exactPoint', 'time']

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    constructor(private activatedRoute: ActivatedRoute, private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private baseInteractionService: BaseInteractionService, private buttonClickService: ButtonClickService) {
        this.loadRecords()
    }

    ngOnInit() {
        this.addShortcuts()
        this.subscribeToInteractionService()
        // this.filterByCriteria()
        this.flattenResults()
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    editRecord(id: number) {
        this.router.navigate([this.url, id])
    }

    onFilter(query: string) {
        // console.log(query)
        this.flatFilteredRecords = query ? this.flatRecords.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.flatRecords
    }

    onNew() {
        this.router.navigate([this.url + '/new'])
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

    private filterByCriteria() {
        this.queryResultClone = this.queryResult
    }

    private flattenResults() {
        this.flatRecords.splice(0)
        for (const {
            id: a,
            route: { abbreviation: b },
            description: c,
            exactPoint: d,
            time: e,
        } of this.queryResult) {
            this.flatRecords.push({ id: a, route: b, description: c, exactPoint: d, time: e })
        }
        this.flatFilteredRecords = this.flatRecords
        // console.log('flatRecords', this.flatRecords)
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
        // console.log('queryResult', this.queryResult)
    }

    private subscribeToInteractionService() {
        this.baseInteractionService.record.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.editRecord(response['id'])
        })
    }

}
