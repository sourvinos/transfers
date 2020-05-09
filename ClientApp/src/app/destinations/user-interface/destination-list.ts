import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HelperService } from 'src/app/shared/services/helper.service';
import { ButtonClickService } from 'src/app/shared/services/button-click.service';
import { InteractionService } from 'src/app/shared/services/interaction.service';
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service';
import { Destination } from '../classes/destination';

@Component({
    selector: 'destination-list',
    templateUrl: './destination-list.html',
    styleUrls: ['../../shared/styles/lists.css']
})

export class DestinationListComponent implements OnInit, OnDestroy {

    records: Destination[]
    filteredRecords: Destination[]
    url = '/destinations'
    resolver = 'destinationList'

    headers = ['S', 'Id', 'Abbreviation', 'Description']
    widths = ['40px', '0px', '150px', '']
    visibility = ['none', 'none', '', '', '']
    justify = ['center', 'center', 'center', 'left']
    fields = ['', 'id', 'abbreviation', 'description']

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    constructor(private activatedRoute: ActivatedRoute, private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private interactionService: InteractionService, private buttonClickService: ButtonClickService, private helperService: HelperService) {
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

    private editRecord(id: number) {
        this.router.navigate([this.url, id])
    }

    private focus(event: KeyboardEvent, element: string) {
        event.preventDefault()
        this.helperService.setFocus(element)
    }

    private loadRecords() {
        this.records = this.activatedRoute.snapshot.data[this.resolver]
        this.filteredRecords = this.records.sort((a, b) => (a.description > b.description) ? 1 : -1)
    }

    private onGoBack() {
        this.router.navigate(['/'])
    }

    private subscribeToInteractionService() {
        this.interactionService.record.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.editRecord(response['id'])
        })
    }

}
