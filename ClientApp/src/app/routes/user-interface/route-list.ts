import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Utils } from 'src/app/shared/classes/utils';
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service';
import { ButtonClickService } from 'src/app/shared/services/button-click.service';
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service';
import { Route } from '../classes/route';

@Component({
    selector: 'route-list',
    templateUrl: './route-list.html',
    styleUrls: ['../../shared/styles/lists.css']
})

export class RouteListComponent implements OnInit, OnDestroy {

    records: Route[]
    filteredRecords: Route[]
    url = '/routes'
    resolver = 'routeList'

    headers = ['Id', 'Description', 'Full description']
    widths = ['0px', '5%', '50%']
    visibility = ['none', '', '']
    justify = ['center', 'center', 'left']
    fields = ['id', 'description', 'fullDescription']

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    constructor(private activatedRoute: ActivatedRoute, private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private baseInteractionService: BaseInteractionService, private buttonClickService: ButtonClickService) {
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

    editRecord(id: number) {
        this.router.navigate([this.url, id])
    }

    onFilter(query: string) {
        this.filteredRecords = query ? this.records.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.records
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

    private focus(event: KeyboardEvent, element: string) {
        event.preventDefault()
        Utils.setFocus(element)
    }

    private onGoBack() {
        this.router.navigate(['/'])
    }

    private loadRecords() {
        this.records = this.activatedRoute.snapshot.data[this.resolver]
        this.filteredRecords = this.records
    }

    private subscribeToInteractionService() {
        this.baseInteractionService.record.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.editRecord(response['id'])
        })
    }

}
