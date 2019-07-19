import * as moment from 'moment'
import { Component, OnInit, AfterViewInit, AfterContentInit, NgZone } from '@angular/core'
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

    queryResult: any = {}
    queryResultFiltered: any = {}
    selectedDate: string
    selectedTransfer: ITransfer
    selectedDestinations: string[] = [];

    form = this.formBuilder.group({
        dateIn: ['', [Validators.required]]
    })

    constructor(private service: TransferService, private formBuilder: FormBuilder) { }

    ngOnInit() {
        get('script.js', () => { })
        this.readDateFromLocalStorage()
        this.selectedDate = this.form.value.dateIn
    }

    ngAfterViewInit(): void {
        this.focusOnElement(0)
    }

    getTransfers() {
        this.service.getTransfers(this.ISODate()).subscribe(data => {
            this.queryResult = this.queryResultFiltered = data
            console.log('From API', data)
            console.log('Results', this.queryResult)
            console.log('Filtered Results', this.queryResultFiltered)
        })
        this.updateLocalStorageWithDate()
        this.selectDestinations()
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
        // this.selectedDestinations = ['ALBANIA', 'BLUE LAGOON']
        console.log('Selected destinations', this.selectedDestinations)
        console.log('Before', this.queryResult.transfers)
        this.queryResultFiltered.transfers = this.queryResult.transfers.filter((x) => { return this.selectedDestinations.indexOf(x.destination.description) !== -1 })
        // let filters = this.queryResults.transfers.filter((d: { destination: { shortDescription: string; }; }) => d.destination.shortDescription == 'AL' || d.destination.shortDescription == 'BL')
        // this.queryResultsFiltered.transfers = this.queryResults.transfers.filter((d: { destination: { shortDescription: string; }; }) => d.destination.shortDescription == 'AL' || d.destination.shortDescription == 'BL')
        console.log('After', this.queryResult.transfers)
        console.log('Filtered', this.queryResultFiltered.transfers)
    }

    resetFilter() {
        console.log('Reset...')
        this.queryResultFiltered.transfers = this.queryResult.transfers.filter()
    }

    splitObject = function (obj: { [x: string]: any; }, keys: { forEach: (arg0: (d: any) => void) => void; }) {
        var holder = {};

        keys.forEach(function (d) {
            holder[d] = obj[d];
        })

        return holder;
    }

    toggleSelected(item: any) {
        var element = document.getElementById(item.description)
        if (element.classList.contains('active')) {
            for (var i = 0; i < this.selectedDestinations.length; i++) {
                if (this.selectedDestinations[i] === item.description) {
                    this.selectedDestinations.splice(i, 1);
                    i--;
                    element.classList.remove('active')
                    break
                }
            }
        } else {
            element.classList.add('active')
            this.selectedDestinations.push(item.description)
        }
    };

    selectDestinations() {
        setTimeout(() => {
            let elements = document.getElementsByClassName("item destination")
            for (let index = 0; index < elements.length; index++) {
                const element = elements[index];
                element.classList.add('active')
                this.selectedDestinations.push(element.id)
            }
        }, (1000));
    };
}

export interface IQueryResult {
    persons: number
    transfers: ITransfer[]
}
