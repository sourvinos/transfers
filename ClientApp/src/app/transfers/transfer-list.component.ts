import { Component, OnInit } from '@angular/core';
import { get } from 'scriptjs';
import { FormBuilder, Validators, FormControl } from '@angular/forms'
import * as moment from 'moment'

import { ITransfer } from './../models/transfer';
import { TransferService } from '../services/transfer.service';

@Component({
    selector: 'app-transfer-list',
    templateUrl: './transfer-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class TransferListComponent implements OnInit {

    transfers: ITransfer[]

    form = this.formBuilder.group({
        dateIn: ['', [Validators.required]]
    })

    constructor(private service: TransferService, private formBuilder: FormBuilder) { }

    ngOnInit() {
        get('script.js', () => { });
    }

    getTransfers() {
        this.service.getTransfers(this.ISODate()).subscribe(data => { this.transfers = data })
    }

    ISODate() {
        return moment(this.form.value.dateIn, 'DD/MM/YYYY').toISOString()
    }

}
