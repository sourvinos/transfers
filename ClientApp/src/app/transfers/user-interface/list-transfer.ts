
import { ITransfer } from './../classes/model-transfer';
import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, Params, NavigationEnd } from '@angular/router';
import { TransferService } from '../classes/service-transfer';
import { Unlisten } from 'src/app/services/keyboard-shortcuts.service';
import { MatTableDataSource } from '@angular/material';
import { ITransferFlat } from 'src/app/models/transfer-flat';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'app-transfer-list',
    templateUrl: './list-transfer.html',
    styleUrls: ['./list-transfer.css']
})

export class TransferListComponent implements AfterViewInit {

    // #region Init

    dateIn: string
    currentDate: string

    queryResult: any = {}
    queryResultClone: any = {}
    queryResultFiltered: any = {}

    selectedDestinations: string[] = []
    selectedCustomers: string[] = []
    selectedRoutes: string[] = []
    selectedDrivers: string[] = []
    selectedPorts: string[] = []

    unlisten: Unlisten

    dataSource: MatTableDataSource<ITransferFlat>
    selection: SelectionModel<[]>

    transfers: ITransfer[]
    transfersClone: ITransfer[]
    transfersFlat: ITransferFlat[] = []

    columns = ['id', 'destination', 'route', 'customer', 'pickupPoint', 'time', 'adults', 'kids', 'free', 'totalPersons', 'driver', 'port']
    fields = ['Id', 'Destination', 'Route', 'Customer', 'Pickup point', 'Time', 'Adults', 'Kids', 'Free', 'Total', 'Driver', 'Port']
    format = ['', '', '', '', '', '', '', '', '', '', '', '']
    width = ['0', '500', '300', '300', '300', '100', '100', '100', '100', '100', '200', '200']
    align = ['center', 'left', 'left', 'left', 'left', 'center', 'right', 'right', 'right', 'right', 'left', 'left']

    navigationSubscription: any

    // #endregion

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private transferService: TransferService) {
        this.activatedRoute.params.subscribe((params: Params) => { this.dateIn = params['dateIn'] })
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd) {
                this.getTransfers()
            }
        })
    }

    ngAfterViewInit() {
        // this.adjustListHeight()
    }

    // T
    getTransfer(transferId: number) {
        this.router.navigate(['transfer/', transferId], {
            relativeTo: this.activatedRoute
        })
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
        this.flattenResults()
        this.dataSource = new MatTableDataSource<ITransferFlat>(this.transfersFlat)
    }

    private getTransfers() {
        // console.log('Getting transfers')
        this.transferService.getTransfers(localStorage.getItem('date')).subscribe((result: any) => {
            this.queryResult = result
            this.queryResultClone = JSON.parse(JSON.stringify(this.queryResult))
            // console.log('Source', this.queryResult)
            // console.log('Clone', this.queryResultClone)
            this.flattenResults()
            this.dataSource = new MatTableDataSource<ITransferFlat>(this.transfersFlat)
            this.selection = new SelectionModel<[]>(false)
            this.selectGroupItems()
        })
    }

    private filterByCriteria() {
        this.queryResultClone = JSON.parse(JSON.stringify(this.queryResult))
        // console.log('BF Source array', this.queryResult.transfers)
        this.queryResultClone.transfers = this.queryResultClone.transfers
            .filter((x: { destination: { description: string } }) => { return this.selectedDestinations.indexOf(x.destination.description) !== -1 })
            .filter((y: { customer: { description: string } }) => { return this.selectedCustomers.indexOf(y.customer.description) !== -1 })
            .filter((z: { pickupPoint: { route: { description: string } } }) => { return this.selectedRoutes.indexOf(z.pickupPoint.route.description) !== -1 })
            .filter((o: { driver: { description: string } }) => { return this.selectedDrivers.indexOf(o.driver.description) !== -1 })
            .filter((p: { port: { description: string } }) => { return this.selectedPorts.indexOf(p.port.description) !== -1 })
        // console.log('AF Source array', this.queryResult.transfers)
        // console.log('AF Filtered array', this.queryResultClone.transfers)
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

    private flattenResults() {
        this.transfersFlat.splice(0)
        for (var {
            id: a,
            destination: { description: b },
            customer: { description: c },
            adults: d,
            kids: e,
            free: f,
            total: g,
            pickupPoint: { description: h, time: i, route: { abbreviation: j } },
            port: { description: k },
            driver: { description: l },
            userName: m,
            dateIn: n,
            remarks: o
        } of this.queryResultClone.transfers) {
            this.transfersFlat.push({ id: a, destination: b, customer: c, adults: d, kids: e, free: f, totalPersons: g, pickupPoint: h, time: i, route: j, port: k, driver: l, userName: m, dateIn: n, remarks: o })
        }
        // console.log('Flat', this.transfersFlat)
    }

    private adjustListHeight() {
        let windowHeight = document.getElementById('sidebar').offsetHeight
        let headerHeight = document.getElementById('header').offsetHeight
        let footerHeight = document.getElementById('footer').offsetHeight
        console.log('Window height', windowHeight)
        console.log('Header height', headerHeight)
        console.log('Footer height', footerHeight)
        let listRouterHeight = windowHeight - headerHeight - footerHeight
        console.log('Router height', listRouterHeight)

        document.getElementById('what').style.height = listRouterHeight + 'px'
    }

}
