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
    }

    ngAfterViewInit(): void {
        this.setElementsWidths()
        this.scrollToEmpty()
        // $('.ui.sticky').sticky({ context: '.ui.table' })
    }

    getTransfers() {
        this.getFilteredTransfers()
        this.selectGroupItems()
        this.isRefreshNeeded()
        this.updateLocalStorageWithDate()
        this.scrollToList()
    }

    populateForm(transfer: ITransfer) {
        this.selectedTransfer = transfer
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
        })
    }

    private setElementsWidths() {
        document.getElementById('header').style.width = this.getBoxWidth() + 'px'
        document.getElementById('empty').style.width = this.getBoxWidth() + 'px'
        // document.getElementById('table').style.minWidth = this.getScrollabelVisibleWidth(this.getBoxWidth(), this.getSummariesPadding(window.getComputedStyle(document.getElementById('summaries')))) + this.getSummariesPadding(window.getComputedStyle(document.getElementById('summaries'))) * 2 + 'px'
        // document.getElementById('list').style.width = this.getBoxWidth() - this.getSummariesPadding(window.getComputedStyle(document.getElementById('summaries'))) + 12 + 'px'
        document.getElementById('list').style.width = this.getBoxWidth() - 25 + 'px'
        document.getElementById('form').style.width = this.getBoxWidth() + 'px'
        document.getElementById('list-footer').style.width = this.getBoxWidth() + 'px'
    }

    private scrollToEmpty() {
        document.getElementById('content').style.left = 0 + 'px'
        console.log('Scrolling to empty')
        console.log('Content left =', document.getElementById('content').style.left)
        // document.getElementById('scrollable').style.left = document.getElementById('sidebar').clientWidth + 'px'
        // document.getElementById('summaries').style.display = 'none'
    }

    private scrollToList() {
        // document.getElementById('summaries').style.display = 'grid'
        // console.log('Empty width', parseInt(document.getElementById('empty').style.minWidth))
        document.getElementById('content').style.left = -parseInt(document.getElementById('empty').style.width) + 'px'
        console.log('Scrolling to list')
        console.log('Content left =', document.getElementById('content').style.left)
        // document.getElementsByTagName('table')[0].style.width = '500px'
    }

    private scrollToForm() {
        document.getElementById('content').style.left = -parseInt(document.getElementById('empty').style.width) - parseInt(document.getElementById('list').style.width) - 20 + 'px'
        console.log('Scrolling to form')
        console.log('Content left =', document.getElementById('content').style.left)
    }

    private isRefreshNeeded() {
        this.service.refreshNeeded.subscribe(() => {
            this.getFilteredTransfers()
            this.clearFilterArrays()
            this.selectGroupItems()
        })
    }

    private clearFilterArrays() {
        this.selectedDestinations.length = 0
        this.selectedCustomers.length = 0
        this.selectedRoutes.length = 0
    }

    private getSummariesPadding(element: CSSStyleDeclaration) {
        return parseInt(element.getPropertyValue('padding-left').substr(0, element.getPropertyValue('padding-left').length - 2))
    }

    private getScrollabelVisibleWidth(boxWidth: number, summariesPaddingLeft: number) {
        return boxWidth
        // return boxWidth - Number(document.getElementById('summaries').clientWidth) - summariesPaddingLeft * 3
    }

    private getBoxWidth() {
        return document.body.clientWidth - Number(document.getElementById('sidebar').clientWidth)
    }

}
