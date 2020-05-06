import { Location } from '@angular/common';
import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Route, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PickupPointService } from 'src/app/pickupPoints/classes/pickupPoint.service';
import { InteractionService } from 'src/app/shared/services/interaction.service';
import { ButtonClickService } from 'src/app/shared/services/button-click.service';
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service';
import { PickupPoint } from '../classes/pickupPoint';

@Component({
    selector: 'pickuppoint-list',
    templateUrl: './pickupPoint-list.html',
    styleUrls: ['./pickupPoint-list.css']
})

export class PickupPointListComponent implements OnInit, DoCheck, OnDestroy {

    wrapperUrl = '/pickupPoints'
    resolver = 'pickupPointList'
    routeId: string
    routes: Route[]
    pickupPoints: PickupPoint[]
    mustRefresh = true

    headers = ['S', 'Id', 'Description', 'Exact point', 'Time']
    widths = ['40px', '0', '45%', '', '100px']
    visibility = ['none', 'none', '', '', '']
    justify = ['center', 'center', 'left', 'left', 'center']
    fields = ['', 'id', 'description', 'exactPoint', 'time']

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private interactionService: InteractionService, private pickupPointService: PickupPointService, private keyboardShortcutsService: KeyboardShortcuts, private buttonClickService: ButtonClickService, private location: Location) {
        this.activatedRoute.params.subscribe((params: Params) => this.routeId = params['routeId'])
        this.router.events.subscribe((navigation: any) => {
            if (navigation instanceof NavigationEnd && this.routeId !== '' && this.router.url.split('/').length === 4) {
                this.mustRefresh = true
                this.loadRecords()
            }
        })
    }

    ngOnInit() {
        this.addShortcuts()
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

    onNew() {
        this.router.navigate([this.location.path() + '/pickupPoint/new'])
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                this.onGoBack()
            },
            'Alt.N': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'new')
            },
        }, {
            priority: 1,
            inputs: true
        })
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

    private onGoBack() {
        this.router.navigate(['/'])
    }

    private subscribeToInteractionService() {
        this.interactionService.record.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.editRecord(response['id'])
        })
        this.interactionService.refreshList.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            this.pickupPointService.getAllForRoute(this.routeId).subscribe(result => {
                this.pickupPoints = result
            })
        })
    }

}
