import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { Utils } from 'src/app/shared/classes/utils';
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service';
import { TransferFlat } from 'src/app/transfers/classes/transferFlat';

@Component({
    selector: 'transfer-wrapper',
    templateUrl: './transfer-wrapper.html',
    styleUrls: ['./transfer-wrapper.css']
})

export class TransferWrapperComponent implements OnInit, OnDestroy {

    dateIn = '20/04/2020'
    dateInISO = ''
    records: string[] = []
    transfersFlat: TransferFlat[] = []
    hasTableData = false

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    constructor(private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.addShortcuts()
        this.focus('dateIn')
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
        this.removeSelectedIdsFromLocalStorage()
    }

    onLoadTransfers() {
        this.clearSelectedArraysFromLocalStorage()
        if (this.isValidDate()) {
            this.updateLocalStorageWithDate()
            this.navigateToList()
        }
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    // this.onGoBack()
                }
            },
            // 'Alt.A': (event: KeyboardEvent) => {
            //     event.preventDefault()
            //     this.clickOnButton('assignDriver')
            // },
            'Alt.C': (event: KeyboardEvent) => {
                event.preventDefault()
                this.clickOnButton('createPdf')
            },
            'Alt.N': (event: KeyboardEvent) => {
                event.preventDefault()
                this.clickOnButton('new')
            },
            'Alt.S': (event: KeyboardEvent) => {
                event.preventDefault()
                alert('Wrapper: Alt+S')
            }
        }, {
            priority: 1,
            inputs: true
        })
    }

    private clearSelectedArraysFromLocalStorage() {
        localStorage.removeItem('transfers')
    }

    private clickOnButton(buttonId: string) {
        const button = document.getElementById(buttonId)
        if (button && !button.attributes['disabled']) {
            button.click()
        }
    }

    private focus(field: string) {
        Utils.setFocus(field)
    }

    onGoBack() {
        this.router.navigate(['../../'], { relativeTo: this.activatedRoute })
    }

    private isValidDate(): boolean {
        const date = (<HTMLInputElement>document.getElementById('dateIn')).value
        if (date.length === 10) {
            this.dateInISO = moment(date, 'DD/MM/YYYY').toISOString(true)
            this.dateInISO = moment(this.dateInISO).format('YYYY-MM-DD')
            return true
        } else {
            this.dateInISO = ''
            return false
        }
    }

    private navigateToList() {
        this.router.navigate(['dateIn/', this.dateInISO], { relativeTo: this.activatedRoute })
    }

    private removeSelectedIdsFromLocalStorage() {
        localStorage.removeItem('selectedIds')
    }

    private updateLocalStorageWithDate() {
        localStorage.setItem('date', this.dateInISO)
    }

}
