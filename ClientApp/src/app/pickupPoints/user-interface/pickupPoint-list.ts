import { Component, OnDestroy, OnInit, DoCheck } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, NavigationEnd, Params, Router, Route } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PickupPointService } from 'src/app/pickupPoints/classes/pickupPoint.service';
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service';
import { PickupPoint } from '../classes/pickupPoint';
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service';
import { RouteService } from 'src/app/routes/classes/route.service';

@Component({
    selector: 'pickuppoint-list',
    templateUrl: './pickupPoint-list.html',
    styleUrls: ['./pickupPoint-list.css']
})

export class PickupPointListComponent implements OnInit, DoCheck, OnDestroy {

    routeId: string
    routes: Route[]
    pickupPoints: PickupPoint[]
    url: '/drivers'
    resolver = 'pickupPointList'
    mustRefresh = true

    headers = ['Id', 'Description', 'Exact point', 'Time']
    widths = ['0', '45%', '45%', '10%']
    visibility = ['none', '', '', '']
    justify = ['center', 'left', 'left', 'center']
    fields = ['id', 'description', 'exactPoint', 'time']

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private baseInteractionService: BaseInteractionService, private pickupPointService: PickupPointService) {
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

    ngDoCheck() {
        if (this.mustRefresh) {
            this.mustRefresh = false
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    private editRecord(id: number) {
        this.navigateToEditRoute(id)
    }

    private loadRecords() {
        this.pickupPoints = this.activatedRoute.snapshot.data[this.resolver]
    }

    private navigateToEditRoute(id: number) {
        this.router.navigate(['pickupPoint/', id], { relativeTo: this.activatedRoute })
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
