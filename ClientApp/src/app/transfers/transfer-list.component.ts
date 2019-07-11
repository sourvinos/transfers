import * as moment from 'moment'
import { Component, OnInit, AfterViewInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { get } from 'scriptjs'

import { ITransfer } from './../models/transfer'
import { TransferService } from '../services/transfer.service'

@Component({
    selector: 'app-transfer-list',
    templateUrl: './transfer-list.component.html',
    styleUrls: ['../shared/styles/lists.css', 'transfer-list.component.css']
})

export class TransferListComponent implements OnInit, AfterViewInit {

    // queryResult: {
    //     persons: number
    //     transfers: ITransfer[]
    //     personsPerCustomer: number[]
    //     personsPerDestination: number[]
    //     personsPerRoute: number[]
    // }
    queryResult: any = {}
    filter: any = {}

    selectedDate: string
    selectedTransfer: ITransfer

    form = this.formBuilder.group({
        dateIn: ['', [Validators.required]]
    })

    constructor(private service: TransferService, private formBuilder: FormBuilder) { }

    ngOnInit() {
        get('script.js', () => { })
        this.readDateFromLocalStorage()
        this.selectedDate = this.form.value.dateIn
        this.getTransfers()
    }

    ngAfterViewInit(): void {
        this.focusOnElement(0)
    }

    getTransfers() {
        this.service.getTransfers(this.ISODate()).subscribe(data => {
            this.queryResult = data
        })
        this.updateLocalStorageWithDate()
    }

    populateForm(transfer: ITransfer) {
        this.selectedTransfer = transfer
    }

    ISODate() {
        return moment(this.form.value.dateIn, 'DD/MM/YYYY').toISOString()
    }

    updateLocalStorageWithDate() {
        localStorage.setItem('date', moment(this.form.value.dateIn, 'DD/MM/YYYY').format('DD/MM/YYYY'))
    }

    readDateFromLocalStorage() {
        this.form.setValue({ 'dateIn': localStorage.getItem('date') })
    }

    focusOnElement(index: number) {
        var elements = document.getElementsByTagName('input')
        elements[index].select()
        elements[index].focus()
    }

    filterByDestination() {
        console.log('Filtering...')
        this.queryResult.transfers = this.queryResult.transfers.filter((d: { destination: { shortDescription: string; }; }) => d.destination.shortDescription == 'AL' || d.destination.shortDescription == 'BL')
    }

    splitObject = function (obj: { [x: string]: any; }, keys: { forEach: (arg0: (d: any) => void) => void; }) {
        var holder = {};

        keys.forEach(function (d) {
            holder[d] = obj[d];
        })

        return holder;
    }



}
