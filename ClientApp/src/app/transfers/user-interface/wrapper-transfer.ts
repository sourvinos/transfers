import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { KeyboardShortcuts, Unlisten } from 'src/app/services/keyboard-shortcuts.service';
import { Utils } from 'src/app/shared/classes/utils';
import { InteractionTransferService } from './../classes/service-interaction-transfer';

@Component({
    selector: 'wrapper-transfer',
    templateUrl: './wrapper-transfer.html',
    styleUrls: ['../../shared/styles/lists.css', './wrapper-transfer.css']
})

export class WrapperTransferComponent implements OnInit, OnDestroy {

    // #region Variables

    dateIn: string = '01/10/2019'
    dateInISO: string = ''

    actionToPerform: string = ''

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    // #endregion Variables

    constructor(private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private activatedRoute: ActivatedRoute, private location: Location, private interactionTransferService: InteractionTransferService) { }

    ngOnInit(): void {
        this.addShortcuts()
        // this.subscribeToInderactionService()
        this.focus('dateIn')
    }

    ngOnDestroy() {
        console.log('Wrapper-onDestroy')
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.unsubscribe();
        this.unlisten && this.unlisten()
    }

    /**
     * Called from the deleteRecord(T)
     * It sends 'deleteRecord' to the form
     * and the form executes the deleteRecord method
     */
    deleteRecord() {
        // this.interactionTransferService.sendData('deleteRecord')
    }

    // T
    loadTransfers() {
        if (this.isCorrectDate()) {
            this.updateLocalStorage()
            this.router.navigate(['dateIn/', this.dateInISO], { relativeTo: this.activatedRoute })
        }
    }

    // T
    newRecord() {
        this.router.navigate([this.location.path() + '/transfer/new'])
    }

    /**
     * Called from the deleteRecord(T)
     * It sends 'saveRecord' to the form
     * and the form executes the saveRecord method
     */
    saveRecord() {
        // this.interactionTransferService.sendData('saveRecord')
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            "Escape": (event: KeyboardEvent): void => {
                this.goBack()
            },
            "Alt.S": (event: KeyboardEvent): void => {
                event.preventDefault()
                document.getElementById('search').click()
            },
            "Alt.N": (event: KeyboardEvent): void => {
                event.preventDefault()
                document.getElementById('new').click()
            }
        }, {
            priority: 1,
            inputs: true
        })
    }

    private focus(field: string) {
        Utils.setFocus(field)
    }

    isCorrectDate() {
        let date = (<HTMLInputElement>document.getElementById('dateIn')).value
        if (date.length == 10) {
            this.dateInISO = moment(date, 'DD/MM/YYYY').toISOString(true)
            this.dateInISO = moment(this.dateInISO).format('YYYY-MM-DD')
            return true
        }
        else {
            this.dateInISO = ''
            return false
        }
    }

    private removeAllSummaryItemsFromLocalStorage() {
        localStorage.removeItem('transfers')
    }

    private updateLocalStorage() {
        localStorage.setItem('date', this.dateInISO)
    }

    /**
     * Accepts data from the constructor of the form 
     * and decides which buttons to display
     */
    private subscribeToInderactionService() {
        //this.interactionTransferService.data.subscribe(response => {
        // this.actionToPerform = response
        //})
    }

    private goBack() {
        this.router.navigate(['/'])
    }

}
