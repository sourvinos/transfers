import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, NavigationEnd, Params, Router, Route } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PickupPointService } from 'src/app/pickupPoints/classes/service-api-pickupPoint';
import { KeyboardShortcuts, Unlisten } from 'src/app/services/keyboard-shortcuts.service';
import { PickupPoint } from './../classes/model-pickupPoint';
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service';
import { RouteService } from 'src/app/routes/classes/service-api-route';

@Component({
    selector: 'list-pickupPoint',
    templateUrl: './list-pickupPoint.html',
    styleUrls: ['./list-pickupPoint.css']
})

export class ListPickupPointComponent implements OnInit, OnDestroy {

    // #region Init

    routeId: string

    routes: Route[] = []
    pickupPoints: PickupPoint[] = []

    headers = ['Id', 'Description', 'Exact point', 'Time']
    widths = ['0', '45%', '45%', '10%']
    visibility = ['none', '', '', '']
    justify = ['center', 'left', 'left', 'center']
    fields = ['id', 'description', 'exactPoint', 'time']

    mustRefresh: boolean = true

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    // #endregion

    constructor(private activatedRoute: ActivatedRoute, private keyboardShortcutsService: KeyboardShortcuts, private router: Router, public dialog: MatDialog, private formBuilder: FormBuilder, private routeService: RouteService, private baseInteractionService: BaseInteractionService, private pickupPointService: PickupPointService) {
        this.activatedRoute.params.subscribe((params: Params) => this.routeId = params['routeId'])
        this.router.events.subscribe((navigation: any) => {
            if (navigation instanceof NavigationEnd && this.routeId != '' && this.router.url.split('/').length == 4) {
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

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten && this.unlisten()
    }

    /**
     * Caller(s):
     *  Class - constructor
     * 
     * Description:
     *  Self-explanatory
     */
    private loadRecords() {
        this.pickupPoints = this.activatedRoute.snapshot.data['pickupPointList']
    }

    /**
     * Caller(s): 
     *  Class - ngOnInit()
     * 
     * Description:
     *  Gets the selected record from the table through the service and executes the editRecord method
     *  Refreshes the list after a new record has been added
     */
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

    /**
     * Caller(s):
     *  Class - subscribeTointeractionService()
     * 
     * Description:
     *  Self-explanatory
     * 
     * @param id 
     */
    private editRecord(id: number) {
        this.navigateToEditRoute(id)
    }

    /**
     * Caller(s):
     *  Class - editRecord()
     * 
     * Description:
     *  Self-explanatory
     * 
     * @param id 
     */
    private navigateToEditRoute(id: number) {
        this.router.navigate(['pickupPoint/', id], { relativeTo: this.activatedRoute })
    }

}