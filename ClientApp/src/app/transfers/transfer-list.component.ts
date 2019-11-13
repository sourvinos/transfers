import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ITransferFlat } from '../models/transfer-flat';
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service';
import { TransferService } from '../services/transfer.service';
import { ComponentInteractionService } from '../shared/services/component-interaction.service';
import { Utils } from './../shared/classes/utils';
import { TransferFormComponent } from './transfer-form.component';

@Component({
    selector: 'app-transfer-list',
    templateUrl: './transfer-list.component.html',
    styleUrls: ['../shared/styles/lists.css', './transfer-list.component.css']
})

export class TransferListComponent implements OnInit, AfterViewInit {

    // #region Init

    queryResult: any = {}
    queryResultFiltered: any = {}

    selectedDestinations: string[] = []
    selectedCustomers: string[] = []
    selectedRoutes: string[] = []
    selectedDrivers: string[] = []
    selectedPorts: string[] = []

    transfersFlat: ITransferFlat[] = []

    columns = ['id', 'destination', 'route', 'customer', 'pickupPoint', 'time', 'adults', 'kids', 'free', 'totalPersons', 'driver', 'port']
    fields = ['Id', 'Destination', 'Route', 'Customer', 'Pickup point', 'Time', 'Adults', 'Kids', 'Free', 'Total', 'Driver', 'Port']
    format = ['', '', '', '', '', '', '', '', '', '', '', '']
    align = ['center', 'left', 'left', 'left', 'left', 'center', 'right', 'right', 'right', 'right', 'left', 'left']

    form = this.formBuilder.group({
        dateIn: ['', [Validators.required]]
    })

    isFormVisible: boolean = false

    unlisten: Unlisten

    dataSource: MatTableDataSource<ITransferFlat>
    selection: SelectionModel<[]>

    // #endregion 

    @ViewChild(TransferFormComponent) private transferForm: TransferFormComponent

    constructor(private service: TransferService, private componentInteractionService: ComponentInteractionService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private keyboardShortcutsService: KeyboardShortcuts) {
        this.unlisten = null
        this.componentInteractionService.changeEmitted.subscribe((result) => {
            this.isFormVisible = result[0]
        })
    }

    ngOnInit() {
        this.readDateFromLocalStorage()
        this.addShortcuts()
    }

    ngAfterViewInit() {
        this.setElementsDimensions()
        this.scrollToEmpty()
        this.setFocus('dateIn')
    }

    // T
    editRecord() {
        this.transferForm.getTransfer(+document.querySelector('.mat-row.selected').children[0].textContent)
    }

    // T
    getTransfers() {
        this.updateLocalStorageWithDate()
        this.getFilteredTransfers().then(() => {
            this.setFocus('dateIn')
            this.selectGroupItems()
            this.scrollToList()
            this.isRefreshNeeded()
        })
    }

    // T
    goBack() {
        this.transferForm.canDeactivate()
    }

    // T
    newRecord() {
        this.transferForm.newRecord()
    }

    // T
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

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            "Escape": (event: KeyboardEvent): void => {
                if (this.isFormVisible && document.getElementsByClassName('cdk-overlay-pane').length == 0) { this.goBack() }
            },
            "Alt.N": (event: KeyboardEvent): void => {
                if (!this.isFormVisible && !document.getElementById('new').hasAttribute('disabled')) { this.transferForm.newRecord() }
            },
            "Alt.D": (event: KeyboardEvent): void => {
                event.preventDefault()
                if (this.isFormVisible && !document.getElementById('delete').classList.contains('hidden') && !document.getElementsByClassName('modal-dialog')[0]) { this.transferForm.deleteRecord() }
            },
            "Alt.S": (event: KeyboardEvent): void => {
                if (!this.isFormVisible && !document.getElementById('go').hasAttribute('disabled')) { this.getTransfers() }
                if (this.isFormVisible && !document.getElementById('save').hasAttribute('disabled')) { this.transferForm.saveRecord() }
                event.preventDefault()
            },
            "Alt.C": (event: KeyboardEvent): void => {
                if (document.getElementsByClassName('modal-dialog')[0]) { document.getElementById('cancel').click() }
            },
            "Alt.O": (event: KeyboardEvent): void => {
                if (document.getElementsByClassName('modal-dialog')[0]) { document.getElementById('ok').click() }
            },

        }, {
            priority: 0,
            inputs: true
        })
    }

    private clearFilterArrays() {
        this.selectedDestinations.length = 0
        this.selectedCustomers.length = 0
        this.selectedRoutes.length = 0
        this.selectedDrivers.length = 0
    }

    private filterByCriteria() {
        this.queryResultFiltered = []
        this.queryResultFiltered.transfers = this.queryResult.transfers
            .filter((x: { destination: { description: string } }) => { return this.selectedDestinations.indexOf(x.destination.description) !== -1 })
            .filter((y: { customer: { description: string } }) => { return this.selectedCustomers.indexOf(y.customer.description) !== -1 })
            .filter((z: { pickupPoint: { route: { description: string } } }) => { return this.selectedRoutes.indexOf(z.pickupPoint.route.description) !== -1 })
            .filter((o: { driver: { description: string } }) => { return this.selectedDrivers.indexOf(o.driver.description) !== -1 })
            .filter((p: { port: { description: string } }) => { return this.selectedPorts.indexOf(p.port.description) !== -1 })
    }

    private getBoxWidth() {
        return document.body.clientWidth - Number(document.getElementById('sidebar').clientWidth)
    }

    private async getFilteredTransfers() {
        await this.service.getTransfers(localStorage.getItem('date')).then(data => {
            this.queryResult = this.queryResultFiltered = data
            for (var {
                id: a,
                destination: { description: b },
                customer: { description: c },
                adults: d,
                kids: e,
                free: f,
                total: g,
                pickupPoint: { description: h, time: i, route: { description: j } },
                port: { description: k },
                driver: { description: l },
                userName: m,
                dateIn: n,
                remarks: o
            } of this.queryResult.transfers) {
                this.transfersFlat.push({ id: a, destination: b, customer: c, adults: d, kids: e, free: f, totalPersons: g, pickupPoint: h, time: i, route: j, port: k, driver: l, userName: m, dateIn: n, remarks: o })
            }
            this.dataSource = new MatTableDataSource<ITransferFlat>(this.transfersFlat)
            this.selection = new SelectionModel<[]>(false)
        })
    }

    private getSummariesWidth() {
        return document.getElementById('summaries').clientWidth
    }

    private isRefreshNeeded() {
        this.service.refreshNeeded.subscribe(() => {
            this.getFilteredTransfers()
            this.clearFilterArrays()
            this.selectGroupItems()
        })
    }

    private readDateFromLocalStorage() {
        this.form.setValue({ 'dateIn': moment(localStorage.getItem('date')).format('DD/MM/YYYY') })
    }

    private scrollToEmpty() {
        document.getElementById('content').style.left = 0 + 'px'
        document.getElementById('empty').style.zIndex = '0'
        this.isFormVisible = false
    }

    private scrollToList() {
        if (this.queryResult.persons > 0) {
            document.getElementById('content').style.left = -parseInt(document.getElementById('empty').style.width) + 'px'
            document.getElementById('empty').style.zIndex = '-1'
        }
        else {
            this.scrollToEmpty()
        }
    }

    private selectGroupItems() {
        this.selectItems('item destination', this.selectedDestinations)
        this.selectItems('item customer', this.selectedCustomers)
        this.selectItems('item route', this.selectedRoutes)
        this.selectItems('item driver', this.selectedDrivers)
        this.selectItems('item port', this.selectedPorts)
    }

    private selectItems(className: string, lookupArray: any) {
        setTimeout(() => {
            let elements = document.getElementsByClassName(className)
            for (let index = 0; index < elements.length; index++) {
                const element = elements[index]
                element.classList.add('activeItem')
                eval(lookupArray).push(element.id)
            }
        }, (500))
    }

    private setElementsDimensions() {
        document.getElementById('header').style.width = this.getBoxWidth() + 'px'
        document.getElementById('empty').style.width = this.getBoxWidth() + 'px'
        document.getElementById('list').style.width = this.getBoxWidth() - this.getSummariesWidth() - 170 + 'px'
        document.getElementById('form').style.width = this.getBoxWidth() - this.getSummariesWidth() - 170 + 'px'
        document.getElementById('summaries').style.height = document.getElementsByClassName('scrollable')[0].clientHeight + 'px'
    }

    private setFocus(element: string) {
        Utils.setFocus(element)
    }

    private updateLocalStorageWithDate() {
        localStorage.setItem('date', moment(this.form.value.dateIn, 'DD/MM/YYYY').toISOString(true))
    }

}
