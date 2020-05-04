import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { Route } from 'src/app/routes/classes/route';
import { RouteService } from 'src/app/routes/classes/route.service';
import { Utils } from 'src/app/shared/classes/utils';
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service';
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service';

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

    constructor(private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private activatedRoute: ActivatedRoute, private location: Location, private interactionPickupPointService: BaseInteractionService, private routeService: RouteService) { }

    ngOnInit() {
        this.addShortcuts()
        this.subscribeTointeractionService()
        this.populateDropDowns()
        this.trackChangesInAutoComplete()
        this.focus('routeDescription')
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.unsubscribe();
        this.unlisten()
    }

    onDelete() {
        this.interactionPickupPointService.performAction('deleteRecord')
    }

    onLoadPickupPoints() {
        this.navigateToList()
    }

    onNew() {
        this.router.navigate([this.location.path() + '/pickupPoint/new'])
    }

    onSelectionChanged(event: { option: { id: string; }; }) {
        this.id = event.option.id
    }

    onSave() {
        this.interactionPickupPointService.performAction('saveRecord')
    }

    inList(): boolean {
        return this.router.url.split('/').length === 4
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': (event: KeyboardEvent): void => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.onGoBack()
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
            priority: 0,
            inputs: true
        })
    }

    private filter(description: string) {
        const filterValue = description.toLowerCase()
        return this.routes.filter(o => o.description.toLowerCase().indexOf(filterValue) === 0)
    }

    private focus(field: string) {
        Utils.setFocus(field)
    }

    private onGoBack() {
        this.router.navigate(['/'])
    }

    private navigateToList() {
        this.router.navigate(['routeId/', this.id], { relativeTo: this.activatedRoute })
    }

    private populateDropDowns() {
        this.routeService.getAll().subscribe((result: any) => {
            this.routes = result
        })
    }

    private subscribeTointeractionService() {
        this.updateRecordStatus()
    }

    private trackChangesInAutoComplete() {
        this.filteredRoutes = this.routeDescription.valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.description),
                map(input => input ? this.filter(input) : this.routes.slice())
            )
    }

    private updateRecordStatus() {
        this.interactionPickupPointService.recordStatus.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.recordStatus = response
        })
    }

}
