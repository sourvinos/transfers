import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { ButtonClickService } from 'src/app/shared/services/button-click.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service';
import { TransferFlat } from 'src/app/transfers/classes/transfer-flat';

@Component({
    selector: 'transfer-wrapper',
    templateUrl: './transfer-wrapper.html',
    styleUrls: ['./transfer-wrapper.css']
})

export class TransferWrapperComponent implements OnInit, OnDestroy {

    //#region Private
    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()
    //#endregion

    //#region Private particular
    dateIn = '20/04/2020'
    dateInISO = ''
    records: string[] = []
    transfersFlat: TransferFlat[] = []
    //#endregion

    constructor(private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private router: Router) { }

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

    public onGoBack() {
        this.router.navigate(['/'])
    }

    public onLoadTransfers() {
        this.clearSelectedArraysFromLocalStorage()
        if (this.onCheckValidDate()) {
            this.updateLocalStorageWithDate()
            this.navigateToList()
        }
    }

    public onCheckValidDate() {
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

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.onGoBack()
                }
            },
            'Alt.S': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'search')
            }
        }, {
            priority: 1,
            inputs: true
        })
    }

    private clearSelectedArraysFromLocalStorage() {
        localStorage.removeItem('transfers')
    }

    private focus(field: string) {
        this.helperService.setFocus(field)
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
