import { Component, OnInit } from '@angular/core'
import { get } from 'scriptjs'
import { FormBuilder, Validators, FormControl } from '@angular/forms'
import * as moment from 'moment'

import { ITransfer } from './../models/transfer'
import { TransferService } from '../services/transfer.service'

@Component({
    selector: 'app-transfer-list',
    templateUrl: './transfer-list.component.html',
    styleUrls: ['../shared/styles/lists.css', 'transfer-list.component.css']
})

export class TransferListComponent implements OnInit {

    queryResult: any = {}
    transfers: ITransfer[]

    form = this.formBuilder.group({
        dateIn: ['', [Validators.required]]
    })

    constructor(private service: TransferService, private formBuilder: FormBuilder) { }

    ngOnInit() {
        get('script.js', () => { })
        this.form.setValue({ dateIn: this.getDateFromLocalStorage() })
        this.getTransfers()
    }

    getTransfers() {
        this.service.getTransfers(this.ISODate()).subscribe(data => {
            this.queryResult = data
            localStorage.setItem('date', this.form.value.dateIn)
        })
    }

    ISODate() {
        return moment(this.form.value.dateIn, 'DD/MM/YYYY').toISOString()
    }

    queryIsEmpty() {
        return this.queryResult.transfers == undefined || this.queryResult.transfers.length == 0 ? true : false
    }

    getDateFromLocalStorage(): string | null {
        var date = localStorage.getItem('date');

        return date;
    }


}
