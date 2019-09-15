// Base
import * as moment from 'moment';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { get } from 'scriptjs';
// Custom
import { TransferService } from '../services/transfer.service';
import { ITransfer } from './../models/transfer';

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
    selectedRoutes: string[] = []

    form = this.formBuilder.group({
        dateIn: ['', [Validators.required]]
    })

    constructor(private service: TransferService, private formBuilder: FormBuilder) { }

    ngOnInit() {
        get('custom.js', () => { })
        this.readDateFromLocalStorage()
        this.selectedDate = this.form.value.dateIn
    }

    ngAfterViewInit(): void {
        this.focusOnElement(0)
    }

    getTransfers() {
        this.updateLocalStorageWithDate()
        this.service.getTransfers(this.ISODate()).subscribe(data => {
            this.queryResult = this.queryResultFiltered = data
            console.log(this.queryResult)
        })
        this.selectItems('item destination', this.selectedDestinations)
        this.selectItems('item customer', this.selectedCustomers)
        this.selectItems('item route', this.selectedRoutes)
    }

    populateForm(transfer: ITransfer) {
        this.selectedTransfer = transfer
    }

    toggleItem(item: any, lookupArray: string) {
        var element = document.getElementById(item.description)
        if (element.classList.contains('activeItem')) {
            for (var i = 0; i < eval(lookupArray).length; i++) {
                if (eval(lookupArray)[i] === item.description) {
                    eval(lookupArray).splice(i, 1)
                    i--
                    element.classList.remove('activeItem')
                    break
                }
            }
        } else {
            element.classList.add('activeItem')
            eval(lookupArray).push(item.description)
        }
        this.filterByCriteria()
    }

    queryIsEmpty() {
        return this.queryResult.transfers == undefined || this.queryResult.transfers.length == 0 ? true : false
    }

    private focusOnElement(index: number) {
        var elements = document.getElementsByTagName('input')
        elements[index].select()
        elements[index].focus()
    }

    private filterByCriteria() {
        this.queryResultFiltered = []
        this.queryResultFiltered.transfers = this.queryResult.transfers
            .filter((x: { destination: { description: string } }) => { return this.selectedDestinations.indexOf(x.destination.description) !== -1 })
            .filter((y: { customer: { description: string } }) => { return this.selectedCustomers.indexOf(y.customer.description) !== -1 })
            .filter((z: { pickupPoint: { route: { description: string; }; }; }) => { return this.selectedRoutes.indexOf(z.pickupPoint.route.description) !== -1 })
    }

    private ISODate() {
        return moment(this.form.value.dateIn, 'DD/MM/YYYY').toISOString()
    }

    private selectItems(className: string, lookupArray: any) {
        setTimeout(() => {
            let elements = document.getElementsByClassName(className)
            for (let index = 0; index < elements.length; index++) {
                const element = elements[index]
                element.classList.add('activeItem')
                eval(lookupArray).push(element.id)
            }
        }, (1000))
    }

    private updateLocalStorageWithDate() {
        localStorage.setItem('date', moment(this.form.value.dateIn, 'DD/MM/YYYY').format('DD/MM/YYYY'))
    }

    private readDateFromLocalStorage() {
        this.form.setValue({ 'dateIn': localStorage.getItem('date') })
    }

}
