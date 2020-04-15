import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { Utils } from 'src/app/shared/classes/utils'
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service'
import { Driver } from '../classes/driver'

@Component({
    selector: 'driver-list',
    templateUrl: './driver-list.html',
    styleUrls: ['../../shared/styles/lists.css']
})

export class DriverListComponent implements OnInit, OnDestroy {

    records: Driver[]
    filteredRecords: Driver[]
    headers = ['Id', 'Name', 'Phones']
    widths = ['0px', '50%', '50%']
    visibility = ['none', '', '']
    justify = ['center', 'left', 'left']
    fields = ['id', 'description', 'phones']
    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    constructor(private activatedRoute: ActivatedRoute, private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private baseInteractionService: BaseInteractionService) {
        this.loadRecords()
    }

    ngOnInit() {
        this.addShortcuts()
        this.focus('searchField')
        this.subscribeToInteractionService()
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    editRecord(id: number) {
        this.navigateToEditRoute(id)
    }

    filter(query: string) {
        this.filteredRecords = query ? this.records.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.records
    }

    newRecord() {
        this.router.navigate(['/drivers/new'])
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': (event: KeyboardEvent): void => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.goBack()
                }
            },
            'Alt.F': (event: KeyboardEvent): void => {
                event.preventDefault()
                this.focus('searchField')
            },
            'Alt.N': (event: KeyboardEvent): void => {
                event.preventDefault()
                document.getElementById('new').click()
            }
        }, {
            priority: 2,
            inputs: true
        })
    }

    private goBack(): void {
        this.router.navigate(['/'])
    }

    private loadRecords() {
        this.records = this.activatedRoute.snapshot.data['driverList']
        this.filteredRecords = this.records
    }

    private focus(element: string) {
        Utils.setFocus(element)
    }

    private subscribeToInteractionService() {
        this.baseInteractionService.record.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.editRecord(response['id'])
        })
    }

    private navigateToEditRoute(id: number) {
        this.router.navigate(['/drivers', id])
    }

}
