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

    queryResult: any = {}
    queryResultFiltered: any = {}
    selectedDate: string
    selectedTransfer: ITransfer
    selectedDestinations: string[] = []
    selectedCustomers: string[] = []

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
        })
        this.updateLocalStorageWithDate()
        this.selectDestinations()
        this.selectCustomers()
    }

    populateForm(transfer: ITransfer) {
        this.selectedTransfer = transfer
    }

    filterByDestination() {
        this.queryResultFiltered = []
        this.queryResultFiltered.transfers = this.queryResult.transfers.filter((x: { destination: { description: string; }; }) => { return this.selectedDestinations.indexOf(x.destination.description) !== -1 })
    }


    filterByCustomer() {
        this.queryResultFiltered = []
        this.queryResultFiltered.transfers = this.queryResult.transfers.filter((x: { customer: { description: string; }; }) => { return this.selectedCustomers.indexOf(x.customer.description) !== -1 })
    }

    toggleDestination(item: any) {
        var element = document.getElementById(item.description)
        console.log(element)
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
        this.filterByDestination()
    };

    toggleCustomer(item: any) {
        var element = document.getElementById(item.description)
        console.log(element)
        if (element.classList.contains('active')) {
            for (var i = 0; i < this.selectedCustomers.length; i++) {
                if (this.selectedCustomers[i] === item.description) {
                    this.selectedCustomers.splice(i, 1);
                    i--;
                    element.classList.remove('active')
                    break
                }
            }
        } else {
            element.classList.add('active')
            this.selectedCustomers.push(item.description)
        }
        this.filterByCustomer()
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

    selectCustomers() {
        setTimeout(() => {
            let elements = document.getElementsByClassName("item customer")
            for (let index = 0; index < elements.length; index++) {
                const element = elements[index];
                element.classList.add('active')
                this.selectedCustomers.push(element.id)
            }
        }, (1000));
    };

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

}
