import { PortService } from '../classes/port.service';
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { Utils } from 'src/app/shared/classes/utils'
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service'
import { Port } from '../classes/port'
import { HttpResponse } from '@angular/common/http';

@Component({
    selector: 'port-list',
    templateUrl: './port-list.html',
    styleUrls: ['../../shared/styles/lists.css']
})

export class PortListComponent implements OnInit, OnDestroy {

    records: Port[]
    filteredRecords: Port[]
    headers = ['Id', 'Description']
    widths = ['0px', '100%']
    visibility = ['none', '']
    justify = ['center', 'left']
    fields = ['id', 'description']
    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    constructor(private activatedRoute: ActivatedRoute, private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private baseInteractionService: BaseInteractionService, private portService: PortService) {
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
        this.router.navigate(['/ports/new'])
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
            priority: 1,
            inputs: true
        })
    }

    private goBack(): void {
        this.router.navigate(['/'])
    }

    private loadRecords() {
        this.records = this.activatedRoute.snapshot.data['portList']
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
        this.router.navigate(['/ports', id])
    }

    createPdf() {
        this.portService.createPDF().subscribe((file: HttpResponse<Blob>) => {
            window.location.href = file.url
        })
    }

}
