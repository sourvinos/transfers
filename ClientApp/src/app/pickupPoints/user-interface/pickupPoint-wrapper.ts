import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service';
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service';
import { FormControl } from '@angular/forms';
import { Utils } from 'src/app/shared/classes/utils';
import { RouteService } from 'src/app/routes/classes/route.service';
import { Route } from 'src/app/routes/classes/route';

@Component({
    selector: 'pickuppoint-wrapper',
    templateUrl: './pickupPoint-wrapper.html',
    styleUrls: ['../../shared/styles/lists.css', './pickupPoint-wrapper.css']
})

export class PickupPointWrapperComponent implements OnInit, OnDestroy {

    id = ''
    routeDescription = new FormControl()
    routes: Route[] = []
    filteredRoutes: Observable<Route[]>
    recordStatus = 'empty'
    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    constructor(private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private activatedRoute: ActivatedRoute, private location: Location, private interactionPickupPointService: BaseInteractionService, public dialog: MatDialog, private routeService: RouteService) { }

    ngOnInit(): void {
        this.addShortcuts()
        this.subscribeTointeractionService()
        this.populateDropDowns()
        this.trackChangesInAutoComplete()
        this.focus('routeDescription')
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.unsubscribe();
        this.unlisten()
    }

    deleteRecord(): void {
        this.interactionPickupPointService.performAction('deleteRecord')
    }

    loadPickupPoints(): void {
        this.navigateToList()
    }

    newRecord(): void {
        this.router.navigate([this.location.path() + '/pickupPoint/new'])
    }

    onSelectionChanged(event: { option: { id: string; }; }) {
        this.id = event.option.id
    }

    saveRecord(): void {
        this.interactionPickupPointService.performAction('saveRecord')
    }

    inList(): boolean {
        return this.router.url.split('/').length === 4
    }

    private addShortcuts(): void {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': (event: KeyboardEvent): void => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.goBack()
                }
            },
            'Alt.S': (event: KeyboardEvent): void => {
                event.preventDefault()
                document.getElementById('search').click()
            },
            'Alt.N': (event: KeyboardEvent): void => {
                event.preventDefault()
                document.getElementById('new').click()
            }
        }, {
            priority: 1,
            inputs: true
        })
    }

    private filter(abbreviation: string) {
        const filterValue = abbreviation.toLowerCase()
        return this.routes.filter(o => o.abbreviation.toLowerCase().indexOf(filterValue) === 0)
    }

    private focus(field: string): void {
        Utils.setFocus(field)
    }

    private goBack(): void {
        this.router.navigate(['/'])
    }

    private navigateToList(): void {
        this.router.navigate(['routeId/', this.id], { relativeTo: this.activatedRoute })
    }

    private populateDropDowns() {
        this.routeService.getAll().subscribe((result: any) => {
            this.routes = result
        })
    }

    private subscribeTointeractionService(): void {
        this.updateRecordStatus()
    }

    private trackChangesInAutoComplete() {
        this.filteredRoutes = this.routeDescription.valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.abbreviation),
                map(input => input ? this.filter(input) : this.routes.slice())
            )
    }

    private updateRecordStatus(): void {
        this.interactionPickupPointService.recordStatus.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.recordStatus = response
        })
    }

}
