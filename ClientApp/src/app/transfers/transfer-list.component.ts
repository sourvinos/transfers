import * as moment from 'moment';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { TransferService } from '../services/transfer.service';
import { ITransfer } from './../models/transfer';

declare var $: any

@Component({
    selector: 'app-transfer-list',
    templateUrl: './transfer-list.component.html',
    styleUrls: ['../shared/styles/lists.css', './transfer-list.component.css']
})

export class TransferListComponent implements OnInit, AfterViewInit {

    queryResult: any = {}
    queryResultFiltered: any = {}

    selectedTransfer: ITransfer

    selectedDestinations: string[] = []
    selectedCustomers: string[] = []
    selectedRoutes: string[] = []

    form = this.formBuilder.group({
        dateIn: ['', [Validators.required]]
    })

    constructor(private service: TransferService, private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.readDateFromLocalStorage()
        this.setWidthsForScrollableElements()
    }

    ngAfterViewInit(): void {
        this.focusOnElement(0)
    }

    getTransfers() {
        this.getFilteredTransfers()
        this.selectGroupItems()
        this.isRefreshNeeded()
        this.scrollToList()
        this.updateLocalStorageWithDate()
    }

    populateForm(transfer: ITransfer) {
        this.updateTransfer(transfer)
        this.scrollToForm()
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

    private selectGroupItems() {
        this.selectItems('item destination', this.selectedDestinations)
        this.selectItems('item customer', this.selectedCustomers)
        this.selectItems('item route', this.selectedRoutes)
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
        localStorage.setItem('date', moment(this.form.value.dateIn, 'DD/MM/YYYY').toISOString(true))
    }

    private readDateFromLocalStorage() {
        this.form.setValue({ 'dateIn': moment(localStorage.getItem('date')).format('DD/MM/YYYY') })
    }

    private getFilteredTransfers() {
        this.service.getTransfers(localStorage.getItem('date')).subscribe((data: any) => {
            this.queryResult = this.queryResultFiltered = data
            document.getElementById("scrollable").style.marginLeft = - this.boxWidth + 'px'
        })
    }

    private setWidthsForScrollableElements() {
        let boxWidth = document.body.clientWidth - Number(document.getElementById('sidebar').clientWidth)
        document.getElementById('header').style.width = boxWidth + 'px'
        document.getElementById('empty').style.minWidth = boxWidth + 'px'
        document.getElementById('summariesGrid').style.minWidth = boxWidth + 'px'
        document.getElementById('form').style.minWidth = boxWidth + 'px'
        document.getElementById('footer').style.width = boxWidth + 'px'
    }

    private isRefreshNeeded() {
        this.service.refreshNeeded.subscribe(() => {
            this.getFilteredTransfers()
            this.clearFilterArrays()
            this.selectGroupItems()
        })
    }

    scrollToHome() {
        document.getElementById('scrollable').style.marginLeft = '0px'
    }

    private scrollToList() {
        document.getElementById('scrollable').style.marginLeft = - this.boxWidth + 'px'
    }

    private scrollToForm() {
        document.getElementById('scrollable').style.marginLeft = - this.boxWidth * 2 + 'px'
    }

    get boxWidth() {
        return document.body.clientWidth - Number(document.getElementById('sidebar').clientWidth)
    }

    get isFormVisible() {
        let marginLeft = document.getElementById('scrollable').style.marginLeft
        let result = Number(marginLeft.substring(0, marginLeft.length - 2))
        return result == -3336
    }

    private clearFilterArrays() {
        this.selectedDestinations.length = 0
        this.selectedCustomers.length = 0
        this.selectedRoutes.length = 0
    }

    private updateTransfer(transfer: ITransfer) {
        this.selectedTransfer = transfer
    }

}
