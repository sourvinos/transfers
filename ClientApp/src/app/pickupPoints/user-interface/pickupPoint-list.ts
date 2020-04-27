import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Route, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PickupPointService } from 'src/app/pickupPoints/classes/pickupPoint.service';
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service';
import { KeyboardShortcuts } from 'src/app/shared/services/keyboard-shortcuts.service';
import { PickupPoint } from '../classes/pickupPoint';
import { RouteService } from 'src/app/routes/classes/route.service';

@Component({
    selector: 'pickuppoint-list',
    templateUrl: './pickupPoint-list.html',
    styleUrls: ['../../shared/styles/lists.css', './pickupPoint-list.css']
})

export class PickupPointListComponent implements OnInit, DoCheck, OnDestroy {

    routeId: string
    routes: Route[]
    selectedRoutes: string[] = []
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

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private baseInteractionService: BaseInteractionService, private pickupPointService: PickupPointService, private routeService: RouteService, private keyboardShortcutsService: KeyboardShortcuts) {
        // this.activatedRoute.params.subscribe((params: Params) => this.routeId = params['routeId'])
        this.loadRecords()
        // this.router.events.subscribe((navigation: any) => {
        //     if (navigation instanceof NavigationEnd && this.routeId !== '' && this.router.url.split('/').length === 4) {
        //         this.mustRefresh = true
        //     }
        // })
    }

    ngOnInit() {
        this.subscribeToInteractionService()
        this.populateRoutes()
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

    private populateRoutes() {
        this.routeService.getAll().subscribe((result: any) => {
            this.routes = result
        })
    }
    onToggleItem(item: any, lookupArray: string[]) {
        this.toggleActiveItem(item, lookupArray)
        // this.filterByCriteria()
        // this.saveToLocalStorage()
    }

    private toggleActiveItem(item: { description: string; }, lookupArray: string[]) {
        const element = document.getElementById(item.description)
        if (element.classList.contains('activeItem')) {
            for (let i = 0; i < lookupArray.length; i++) {
                if ((lookupArray)[i] === item.description) {
                    lookupArray.splice(i, 1)
                    i--
                    element.classList.remove('activeItem')
                    break
                }
            }
        } else {
            element.classList.add('activeItem')
            lookupArray.push(item.description)
        }
    }

}
