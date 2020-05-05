import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Utils } from 'src/app/shared/classes/utils';
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service';
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service';
import { Customer } from '../classes/customer';
import { ButtonClickService } from './../../shared/services/button-click.service';

@Component({
    selector: 'customer-list',
    templateUrl: './customer-list.html',
    styleUrls: ['../../shared/styles/lists.css']
})

export class CustomerListComponent implements OnInit, OnDestroy {

    records: Customer[]
    filteredRecords: Customer[]
    url = '/customers'
    resolver = 'customerList'

    headers = ['Id', 'Description', 'Phones', 'Email']
    widths = ['0px', '50%', '25%', '25%']
    visibility = ['none', '', '', '']
    justify = ['center', 'left', 'left', 'left']
    fields = ['id', 'description', 'phones', 'email']

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
            'Control.F': (event: KeyboardEvent): void => {
                this.focus(event, 'searchField')
            },
            'Control.N': (event: KeyboardEvent): void => {
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
        Utils.setFocus(element)
    }

    private loadRecords() {
        this.records = this.activatedRoute.snapshot.data[this.resolver]
        this.filteredRecords = this.records
    }

    private onGoBack() {
        this.router.navigate(['/'])
    }

    private subscribeToInteractionService() {
        this.baseInteractionService.record.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.editRecord(response['id'])
        })
    }

}
