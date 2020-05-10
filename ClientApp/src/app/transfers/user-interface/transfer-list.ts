import { Location } from '@angular/common'
import { AfterViewChecked, AfterViewInit, Component, DoCheck, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { DriverService } from 'src/app/drivers/classes/driver.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { MessageService } from 'src/app/shared/services/message.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { TransferPdfService } from '../classes/transfer-pdf.service'
import { TransferService } from '../classes/transfer.service'
import { TransferFlat } from '../classes/transferFlat'
import { TransferAssignDriverComponent } from './transfer-assign-driver'

@Component({
    selector: 'transfer-list',
    templateUrl: './transfer-list.html',
    styleUrls: ['./transfer-list.css']
})

export class TransferListComponent implements OnInit, AfterViewInit, AfterViewChecked, DoCheck, OnDestroy {

    wrapperUrl = '/transfers'
    resolver = 'transferList'
    dateIn: string
    queryResult: any = {}
    queryResultClone: any = {}
    records: string[] = []
    totals: any[] = []
    selectedDestinations: string[] = []
    selectedCustomers: string[] = []
    selectedRoutes: string[] = []
    selectedDrivers: string[] = []
    selectedPorts: string[] = []
    checkedDestinations = true
    checkedCustomers = true
    checkedRoutes = true
    checkedDrivers = true
    checkedPorts = true
    transfersFlat: TransferFlat[] = []
    mustRefresh = true

    headers = ['S', 'Id', 'Dest', 'Route', 'Customer', 'Pickup point', 'Time', 'A', 'K', 'F', 'T', 'Driver', 'Port']
    widths = ['40px', '100px', '50px', '100px', '200px', '200px', '60px', '40px', '40px', '40px', '40px', '100px', '100px']
    visibility = ['', 'none', '', '', '', '', '', '', '', '', '', '', '']
    justify = ['center', 'center', 'center', 'center', 'left', 'left', 'center', 'right', 'right', 'right', 'right', 'left', 'left']
    fields = ['', 'id', 'destination', 'route', 'customer', 'pickupPoint', 'time', 'adults', 'kids', 'free', 'totalPersons', 'driver', 'port']

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private interactionService: InteractionService, private service: TransferService, private pdfService: TransferPdfService, private driverService: DriverService, private location: Location, private snackbarService: SnackbarService, public dialog: MatDialog, private transferService: TransferService, private helperService: HelperService, private messageService: MessageService, private keyboardShortcutsService: KeyboardShortcuts, private buttonClickService: ButtonClickService) {
        this.activatedRoute.params.subscribe((params: Params) => this.dateIn = params['dateIn'])
        this.router.events.subscribe((navigation: any) => {
            if (navigation instanceof NavigationEnd && this.dateIn !== '' && this.router.url.split('/').length === 4) {
                this.mustRefresh = true
                this.loadRecords()
            }
        })
    }

    ngOnInit() {
        this.addShortcuts()
        this.initPersonsSumArray()
        this.subscribeToInteractionService()
    }

    ngAfterViewInit() {
        if (this.isDataInLocalStorage()) {
            this.updateSelectedArraysFromLocalStorage()
        } else {
            this.updateSelectedArraysFromInitialResults()
            this.saveToLocalStorage()
        }
        this.addActiveClassToSelectedArrays()
        this.filterByCriteria()
        this.initCheckedPersons()
        this.updateTotals()
        this.flattenResults()
    }

    ngAfterViewChecked() {
        document.getElementById('summaries').style.height = document.getElementById('listFormCombo').offsetHeight - 125 + 'px'
    }

    ngDoCheck() {
        if (this.mustRefresh) {
            this.mustRefresh = false
            this.ngAfterViewInit()
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    onAssignDriver() {
        if (this.isRecordSelected()) {
            const dialogRef = this.dialog.open(TransferAssignDriverComponent, {
                height: '350px',
                width: '550px',
                data: {
                    title: 'Assign driver',
                    drivers: this.driverService.getAll(),
                    actions: ['cancel', 'ok']
                },
                panelClass: 'dialog'
            })
            dialogRef.afterClosed().subscribe(result => {
                if (result !== undefined) {
                    this.transferService.assignDriver(result, this.records).subscribe(() => {
                        this.removeSelectedIdsFromLocalStorage()
                        this.navigateToList()
                        this.showSnackbar(this.messageService.recordsHaveBeenProcessed(), 'info')
                    })
                }
            })
        }
    }

    onCreatePdf() {
        this.pdfService.createReport(this.transfersFlat, this.getDriversFromLocalStorage(), this.dateIn)
    }

    onNew() {
        this.driverService.getDefaultDriver().subscribe(response => {
            this.router.navigate([this.location.path() + '/transfer/new'])
        }, () => {
            this.showSnackbar(this.messageService.noDefaultDriverFound(), 'error')
        })
    }

    onToggleItem(item: any, lookupArray: string[]) {
        this.toggleActiveItem(item, lookupArray)
        this.initCheckedPersons()
        this.filterByCriteria()
        this.updateTotals()
        this.flattenResults()
        this.saveToLocalStorage()
    }

    onToggleItems(className: string, lookupArray: { splice: (arg0: number) => void }, checkedArray: any) {
        event.stopPropagation()
        lookupArray.splice(0)
        this.selectItems(className, lookupArray, !checkedArray)
        this.filterByCriteria()
        this.initCheckedPersons()
        this.updateTotals()
        this.flattenResults()
    }

    private addActiveClassToElements(className: string, lookupArray: string[]) {
        const elements = document.querySelectorAll(className)
        elements.forEach((element) => {
            const position = lookupArray.indexOf(element.id)
            if (position >= 0) {
                element.classList.add('activeItem')
            }
        })
    }

    private addActiveClassToSelectedArrays() {
        setTimeout(() => {
            this.addActiveClassToElements('.item.destination', this.selectedDestinations)
            this.addActiveClassToElements('.item.customer', this.selectedCustomers)
            this.addActiveClassToElements('.item.route', this.selectedRoutes)
            this.addActiveClassToElements('.item.driver', this.selectedDrivers)
            this.addActiveClassToElements('.item.port', this.selectedPorts)
        }, 100)
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                this.onGoBack()
            },
            'Alt.A': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'assignDriver')
            },
            'Alt.C': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'createPdf')
            },
            'Alt.N': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'new')
            },
        }, {
            priority: 2,
            inputs: true
        })
    }

    private editRecord(id: number) {
        this.navigateToEditRoute(id)
    }

    private filterByCriteria() {
        this.queryResultClone.transfers = this.queryResult.transfers
            .filter((destination: { destination: { description: string } }) => this.selectedDestinations.indexOf(destination.destination.description) !== -1)
            .filter((customer: { customer: { description: string } }) => this.selectedCustomers.indexOf(customer.customer.description) !== -1)
            .filter((route: { pickupPoint: { route: { description: string } } }) => this.selectedRoutes.indexOf(route.pickupPoint.route.description) !== -1)
            .filter((driver: { driver: { description: string } }) => this.selectedDrivers.indexOf(driver.driver.description) !== -1)
            .filter((port: { pickupPoint: { route: { port: { description: string } } } }) => this.selectedPorts.indexOf(port.pickupPoint.route.port.description) !== -1)
    }

    private flattenResults() {
        this.transfersFlat.splice(0)
        for (const {
            id: a,
            destination: { abbreviation: b },
            customer: { description: c },
            adults: d,
            kids: e,
            free: f,
            totalPersons: g,
            pickupPoint: { description: h, time: i, route: { description: j, port: { description: k } } },
            driver: { description: l },
            userName: m,
            dateIn: n,
            remarks: o
        } of this.queryResultClone.transfers) {
            this.transfersFlat.push({ id: a, destination: b, customer: c, adults: d, kids: e, free: f, totalPersons: g, pickupPoint: h, time: i, route: j, port: k, driver: l, userName: m, dateIn: n, remarks: o })
        }
    }

    private getDriversFromLocalStorage() {
        const localStorageData = JSON.parse(localStorage.getItem('transfers'))
        return JSON.parse(localStorageData.drivers)
    }

    private initCheckedPersons() {
        this.interactionService.setCheckedTotalPersons(0)
    }

    private initPersonsSumArray() {
        this.totals.push(
            { description: 'ALL', sum: 0 },
            { description: 'DISPLAYED', sum: 0 },
            { description: 'CHECKED', sum: 0 }
        )
    }

    private isDataInLocalStorage() {
        return localStorage.getItem('transfers')
    }

    private isRecordSelected() {
        if (this.totals[2].sum === 0) {
            this.showSnackbar(this.messageService.noRecordsSelected(), 'error')
            return false
        }
        return true
    }

    private loadRecords() {
        this.queryResult = this.activatedRoute.snapshot.data[this.resolver]
    }

    private navigateToEditRoute(id: number) {
        this.router.navigate(['transfer/', id], { relativeTo: this.activatedRoute })
    }

    private navigateToList() {
        this.router.navigate(['transfers/dateIn/', this.helperService.getDateFromLocalStorage()])
    }

    private onGoBack() {
        this.router.navigate(['/'])
    }

    private removeSelectedIdsFromLocalStorage() {
        localStorage.removeItem('selectedIds')
    }

    private saveToLocalStorage() {
        const summaryItems = {
            'destinations': JSON.stringify(this.selectedDestinations),
            'customers': JSON.stringify(this.selectedCustomers),
            'routes': JSON.stringify(this.selectedRoutes),
            'drivers': JSON.stringify(this.selectedDrivers),
            'ports': JSON.stringify(this.selectedPorts),
        }
        localStorage.setItem('transfers', JSON.stringify(summaryItems))
        localStorage.removeItem('selectedIds')
    }

    private selectItems(className: string, lookupArray: any, checked: boolean) {
        const elements = document.getElementsByClassName('item ' + className)
        for (let index = 0; index < elements.length; index++) {
            const element = elements[index]
            if (checked) {
                element.classList.add('activeItem')
                lookupArray.push(element.id)
            } else {
                element.classList.remove('activeItem')
            }
        }
    }

    private showSnackbar(message: string, type: string) {
        this.snackbarService.open(message, type)
    }

    private subscribeToInteractionService() {
        this.interactionService.record.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.editRecord(response['id'])
        })
        this.interactionService.refreshList.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            this.service.getTransfers(this.dateIn).subscribe(result => {
                this.queryResult = result
                this.ngAfterViewInit()
            })
        })
    }

    private toggleActiveItem(item: { description: string }, lookupArray: string[]) {
        const element = document.getElementById(item.description)
        if (element.classList.contains('activeItem')) {
            for (let i = 0; i < lookupArray.length; i++) {
                if ((lookupArray)[i] === item.description) {
                    lookupArray.splice(i, 1)
                    i--
                    element.classList.remove('activeItem')
                    break
                }
            }
        } else {
            element.classList.add('activeItem')
            lookupArray.push(item.description)
        }
    }

    private updateSelectedArraysFromInitialResults() {
        this.queryResult.personsPerDestination.forEach((element: { description: string }) => { this.selectedDestinations.push(element.description) })
        this.queryResult.personsPerCustomer.forEach((element: { description: string }) => { this.selectedCustomers.push(element.description) })
        this.queryResult.personsPerRoute.forEach((element: { description: string }) => { this.selectedRoutes.push(element.description) })
        this.queryResult.personsPerDriver.forEach((element: { description: string }) => { this.selectedDrivers.push(element.description) })
        this.queryResult.personsPerPort.forEach((element: { description: string }) => { this.selectedPorts.push(element.description) })
    }

    private updateSelectedArraysFromLocalStorage() {
        const localStorageData = JSON.parse(localStorage.getItem('transfers'))
        this.selectedDestinations = JSON.parse(localStorageData.destinations)
        this.selectedCustomers = JSON.parse(localStorageData.customers)
        this.selectedRoutes = JSON.parse(localStorageData.routes)
        this.selectedDrivers = JSON.parse(localStorageData.drivers)
        this.selectedPorts = JSON.parse(localStorageData.ports)
    }

    private updateTotals() {
        this.totals[0].sum = this.queryResult.persons
        this.totals[1].sum = this.queryResultClone.transfers.reduce((sum: any, array: { totalPersons: any }) => sum + array.totalPersons, 0)
        this.interactionService.checked.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
            this.totals[2].sum = result
        })
    }

}
