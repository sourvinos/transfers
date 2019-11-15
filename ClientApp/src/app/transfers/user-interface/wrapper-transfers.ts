import { CountdownService } from './../../services/countdown.service';
import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import * as moment from 'moment';
import { Utils } from 'src/app/shared/classes/utils';

@Component({
    selector: 'app-transfers',
    templateUrl: './wrapper-transfers.html',
    styleUrls: ['../../shared/styles/lists.css', './wrapper-transfers.css']
})

export class TransfersComponent {

    date: string = ''

    constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.setFocus('date')
        this.readDateFromLocalStorage()
    }

    loadTransfers() {
        this.updateLocalStorageWithDate()
        this.router.navigate(['/transfers/date/' + localStorage.getItem('date')])
    }

    newRecord() {
        this.router.navigate(['/transfers/date/' + localStorage.getItem('date') + '/transfer/new'])
    }

    private updateLocalStorageWithDate() {
        localStorage.setItem('date', moment(this.date, 'DD/MM/YYYY').format('YYYY-MM-DD'))
    }

    private readDateFromLocalStorage() {
        this.date = moment(localStorage.getItem('date')).format('DD/MM/YYYY')
    }

    private setFocus(element: string) {
        Utils.setFocus(element)
    }

}
