import { Location } from '@angular/common'
import { AfterViewInit, Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from '@angular/router'
import * as moment from 'moment'
import { Utils } from 'src/app/shared/classes/utils'
import { Unlisten, KeyboardShortcuts } from 'src/app/services/keyboard-shortcuts.service'

@Component({
    selector: 'app-transfer-wrapper',
    templateUrl: './wrapper-transfer.html',
    styleUrls: ['../../shared/styles/lists.css', './wrapper-transfer.css']
})

export class TransferWrapperComponent implements OnInit {

    dateIn: string = ''
    dateInISO: string = ''

    unlisten: Unlisten

    constructor(private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private activatedRoute: ActivatedRoute, private location: Location) {
        this.unlisten = null
    }

    ngOnInit(): void {
        this.addShortcuts()
        this.focus('dateIn')
    }

    // T
    loadTransfers() {
        if (this.isCorrectDate()) {
            this.router.navigate(['dateIn/', this.dateInISO], { relativeTo: this.activatedRoute })
        }
    }

    // T
    newRecord() {
        this.router.navigate([this.location.path() + '/transfer/new'])
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            "Alt.S": (event: KeyboardEvent): void => {
                // event.preventDefault()
                document.getElementById('search').click()
            },
            "Alt.N": (event: KeyboardEvent): void => {
                // event.preventDefault()
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

    private isCorrectDate() {
        let date = (<HTMLInputElement>document.getElementById('dateIn')).value
        if (date.length == 10) {
            this.dateInISO = moment(date, 'DD/MM/YYYY').toISOString(true)
            this.dateInISO = moment(this.dateInISO).format('YYYY-MM-DD')
            localStorage.setItem('date', this.dateInISO)
            return true
        }
        else {
            this.dateInISO = ''
            return false
        }
    }

}
