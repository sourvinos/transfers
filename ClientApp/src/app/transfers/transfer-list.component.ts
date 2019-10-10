import * as moment from 'moment';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { TransferService } from '../services/transfer.service';
import { ITransfer } from './../models/transfer';
import { Utils } from './../shared/classes/utils';
import { TransferFormComponent } from './transfer-form.component';

@Component({
    selector: 'app-transfer-list',
    templateUrl: './transfer-list.component.html',
    styleUrls: ['../shared/styles/lists.css', './transfer-list.component.css']
})

export class TransferListComponent implements OnInit, AfterViewInit {

    queryResult: any = {}
    queryResultFiltered: any = {}

    selectedDestinations: string[] = []
    selectedCustomers: string[] = []
    selectedRoutes: string[] = []

    form = this.formBuilder.group({
        dateIn: ['', [Validators.required]]
    })

    isNewRecord: boolean = false
    isFormVisible: boolean = false

    @ViewChild(TransferFormComponent) private transferForm: TransferFormComponent

    constructor(private service: TransferService, private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.readDateFromLocalStorage()
    }

    ngAfterViewInit(): void {
        this.setElementsWidths()
        this.scrollToEmpty()
        this.setFocus('dateIn')
    }

    getTransfers() {
        this.updateLocalStorageWithDate()
        this.getFilteredTransfers().then(() => {
            this.selectGroupItems()
            this.scrollToList()
            this.isRefreshNeeded()
        })
    }

    private async getFilteredTransfers() {
        await this.service.getTransfers(localStorage.getItem('date')).then(data => this.queryResult = this.queryResultFiltered = data)
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
            .filter((z: { pickupPoint: { route: { description: string } } }) => { return this.selectedRoutes.indexOf(z.pickupPoint.route.description) !== -1 })
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


    private setElementsWidths() {
        document.getElementById('header').style.width = this.getBoxWidth() + 'px'
        document.getElementById('empty').style.width = this.getBoxWidth() + 'px'
        document.getElementById('list').style.width = this.getBoxWidth() - this.getSummariesWidth() - 25 + 'px'
        document.getElementById('form').style.width = this.getBoxWidth() - this.getSummariesWidth() - 25 + 'px'
        document.getElementById('footer').style.width = this.getBoxWidth() + 'px'
    }

    private scrollToEmpty() {
        document.getElementById('content').style.left = 0 + 'px'
    }

    private scrollToList() {
        if (this.queryResult.persons > 0)
            document.getElementById('content').style.left = -parseInt(document.getElementById('empty').style.width) + 'px'
        else
            this.scrollToEmpty()
    }

    private scrollBackToList() {
        document.getElementById('list').style.marginLeft = 0 + 'px'
        this.isFormVisible = false
    }

    newRecord() {
        this.isFormVisible = true
        this.transferForm.newRecord()
    }

    editRecord(transfer: ITransfer) {
        this.isFormVisible = true
        this.transferForm.editRecord(transfer)
    }

    saveRecord() {
        this.transferForm.saveRecord()
        this.scrollBackToList()
    }

    deleteRecord() {
        this.transferForm.deleteRecord()
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

    private getSummariesWidth() {
        return document.getElementById('summaries').clientWidth
    }

    private getBoxWidth() {
        return document.body.clientWidth - Number(document.getElementById('sidebar').clientWidth)
    }

    public scrollBackToListFromForm() {
        this.scrollBackToList()
    }

    private setFocus(element: string) {
        Utils.setFocus(element)
    }

}
