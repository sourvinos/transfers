import { AfterViewChecked, Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Route, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PickupPointService } from 'src/app/pickupPoints/classes/pickupPoint.service';
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service';
import { KeyboardShortcuts } from 'src/app/shared/services/keyboard-shortcuts.service';
import { PickupPoint } from '../classes/pickupPoint';

@Component({
    selector: 'pickuppoint-list',
    templateUrl: './pickupPoint-list.html',
    styleUrls: ['./pickupPoint-list.css']
})

export class PickupPointListComponent implements OnInit, AfterViewChecked, DoCheck, OnDestroy {

    routeId: string
    routes: Route[]
    pickupPoints: PickupPoint[]
    url = '/pickupPoints'
    resolver = 'pickupPointList'
    mustRefresh = true

    headers = ['Id', 'Description', 'Exact point', 'Time']
    widths = ['0', '45%', '45%', '10%']
    visibility = ['none', '', '', '']
    justify = ['center', 'left', 'left', 'center']
    fields = ['id', 'description', 'exactPoint', 'time']

    ngUnsubscribe = new Subject<void>();

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private baseInteractionService: BaseInteractionService, private pickupPointService: PickupPointService, private keyboardShortcutsService: KeyboardShortcuts) {
        this.activatedRoute.params.subscribe((params: Params) => this.routeId = params['routeId'])
        this.router.events.subscribe((navigation: any) => {
            if (navigation instanceof NavigationEnd && this.routeId !== '' && this.router.url.split('/').length === 4) {
                this.mustRefresh = true
                this.loadRecords()
            }
        })
    }

    ngOnInit() {
        this.subscribeToInteractionService()
    }

    ngAfterViewChecked() {
        // document.getElementById('summaries').style.height = document.getElementById('listFormCombo').offsetHeight - 102 + 'px'
    }

    ngDoCheck() {
        if (this.mustRefresh) {
            this.mustRefresh = false
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
    }

    private editRecord(id: number) {
        this.router.navigate(['pickupPoint/', id], { relativeTo: this.activatedRoute })
    }

    private loadRecords() {
        this.pickupPoints = this.activatedRoute.snapshot.data[this.resolver]
    }

    private subscribeToInteractionService() {
        this.baseInteractionService.record.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.editRecord(response['id'])
        })
        this.baseInteractionService.refreshList.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            this.pickupPointService.getAllForRoute(this.routeId).subscribe(result => {
                this.pickupPoints = result
            })
        })
    }

}
