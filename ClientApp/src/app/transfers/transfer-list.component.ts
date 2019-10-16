import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import * as moment from 'moment'

import { ComponentInteractionService } from '../shared/services/component-interaction.service'
import { TransferFormComponent } from './transfer-form.component'
import { TransferService } from '../services/transfer.service'
import { Utils } from './../shared/classes/utils'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'

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
    selectedDate: string = ''

    keyboardShortcuts: KeyboardShortcuts
    unlisten: Unlisten

    @ViewChild(TransferFormComponent) private transferForm: TransferFormComponent

    constructor(private service: TransferService, private componentInteractionService: ComponentInteractionService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, keyboardShortcuts: KeyboardShortcuts) {
        this.keyboardShortcuts = keyboardShortcuts
        this.unlisten = null
        this.componentInteractionService.changeEmitted.subscribe((result) => {
            this.isFormVisible = result[0]
        })
    }

    ngOnInit() {
        this.scrollToEmpty()
        this.readDateFromLocalStorage()
        this.addShortcuts()
    }

    ngAfterViewInit() {
        this.setElementsWidths()
        this.scrollToEmpty()
        this.setFocus('dateIn')
    }

    private async getFilteredTransfers() {
        await this.service.getTransfers(localStorage.getItem('date')).then(data => {
            this.queryResult = this.queryResultFiltered = data
            this.selectedDate = this.form.value.dateIn
        })
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
    }

    private scrollToEmpty() {
        document.getElementById('content').style.left = 0 + 'px'
        this.isFormVisible = false
    }

    private scrollToList() {
        if (this.queryResult.persons > 0)
            document.getElementById('content').style.left = -parseInt(document.getElementById('empty').style.width) + 'px'
        else
            this.scrollToEmpty()
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

    private setFocus(element: string) {
        Utils.setFocus(element)
    }

    newRecord() {
        this.transferForm.newRecord()
    }

    goBack() {
        this.transferForm.canDeactivate()
    }

    getTransfers() {
        this.updateLocalStorageWithDate()
        this.getFilteredTransfers().then(() => {
            this.selectGroupItems()
            this.scrollToList()
            this.isRefreshNeeded()
        })
    }

    getTransfer(id: number) {
        this.transferForm.getTransfer(id)
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

    addShortcuts() {
        this.unlisten = this.keyboardShortcuts.listen({
            "Ctrl.S": (event: KeyboardEvent): void => {
                if (this.isFormVisible && !document.getElementsByClassName('modal-dialog')[0]) {
                    console.log("Parent: Ctrl.S")
                    this.transferForm.saveRecord()
                    event.preventDefault()
                }
            },
            "Escape": (event: KeyboardEvent): void => {
                if (this.isFormVisible && !document.getElementsByClassName('modal-dialog')[0]) {
                    this.goBack()
                }
            }
        }, {
            priority: 0,
            inputs: true
        })
    }

}
