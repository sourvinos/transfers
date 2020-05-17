import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RouteService } from 'src/app/routes/classes/route.service';
import { ButtonClickService } from 'src/app/shared/services/button-click.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { InteractionService } from 'src/app/shared/services/interaction.service';
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service';
import { PickupPoint } from '../classes/pickupPoint';

@Component({
    selector: 'pickuppoint-list',
    templateUrl: './pickupPoint-list.html',
    styleUrls: ['../../shared/styles/lists.css', './pickupPoint-list.css']
})

export class PickupPointListComponent implements OnInit, OnDestroy {

    //#region Private
    records: PickupPoint[] = []
    filteredRecords: PickupPoint[] = []
    resolver = 'pickupPointList'
    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()
    //#endregion

    //#region Private particular
    routeDescription: string
    //#endregion

    //#region Form
    headers = ['S', 'Id', 'Description', 'Exact point', 'Time']
    widths = ['40px', '0', '45%', '', '100px']
    visibility = ['none', 'none', '', '', '']
    justify = ['center', 'center', 'left', 'left', 'center']
    fields = ['', 'id', 'description', 'exactPoint', 'time']
    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private interactionService: InteractionService, private routeService: RouteService, private keyboardShortcutsService: KeyboardShortcuts, private buttonClickService: ButtonClickService, private location: Location, private helperService: HelperService) {
        this.activatedRoute.params.subscribe(p => {
            this.getRouteDescription(p.routeId)
        })
        this.loadRecords()
    }

    ngOnInit() {
        this.addShortcuts()
        this.subscribeToInteractionService()
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    public onFilter(query: string) {
        this.filteredRecords = query ? this.records.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.records
    }

    public onGoBack() {
        this.router.navigate(['../../'], { relativeTo: this.activatedRoute })
    }

    public onNew() {
        this.router.navigate([this.location.path() + '/pickupPoint/new']) // OK
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'goBack')
            },
            'Alt.F': (event: KeyboardEvent) => {
                this.focus(event, 'searchField')
            },
            'Alt.N': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'new')
            },
        }, {
            priority: 0,
            inputs: true
        })
    }

    private editRecord(id: number) {
        this.router.navigate(['pickupPoint/', id], { relativeTo: this.activatedRoute })
    }

    private focus(event: KeyboardEvent, element: string) {
        event.preventDefault()
        this.helperService.setFocus(element)
    }

    private getRouteDescription(routeId: number) {
        this.routeService.getSingle(routeId).subscribe(result => {
            this.routeDescription = result.description
        })
    }

    private loadRecords() {
        this.records = this.activatedRoute.snapshot.data[this.resolver]
        this.filteredRecords = this.records.sort((a, b) => (a.description > b.description) ? 1 : -1)
    }

    private subscribeToInteractionService() {
        this.interactionService.record.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.editRecord(response['id'])
        })
    }

}
