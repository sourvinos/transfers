import { AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Unlisten } from 'src/app/services/keyboard-shortcuts.service';
import { Utils } from 'src/app/shared/classes/utils';
import { ITransferFlat } from '../classes/model-transfer-flat';
import { TransferService } from '../classes/service-api-transfer';
import { InteractionTransferService } from '../classes/service-interaction-transfer';

@Component({
    selector: 'list-transfer',
    templateUrl: './list-transfer.html',
    styleUrls: ['./list-transfer.css']
})

export class ListTransferComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

    // #region Init

    dateIn: string

    queryResult: any = {}
    queryResultClone: any = {}

    totals: any[] = []

    selectedDestinations: string[] = []
    selectedCustomers: string[] = []
    selectedRoutes: string[] = []
    selectedDrivers: string[] = []
    selectedPorts: string[] = []

    checkedDestinations: boolean = true
    checkedCustomers: boolean = true
    checkedRoutes: boolean = true
    checkedDrivers: boolean = true
    checkedPorts: boolean = true

    transfersFlat: ITransferFlat[] = []

    headers = ['S', 'Id', 'Dest', 'Route', 'Customer', 'Pickup point', 'Time', 'A', 'K', 'F', 'T', 'Driver', 'Port']
    widths = ['40px', '100px', '50px', '100px', '200px', '200px', '60px', '40px', '40px', '40px', '40px', '100px', '100px']
    visibility = ['', 'none', '', '', '', '', '', '', '', '', '', '', '']
    justify = ['center', 'center', 'center', 'center', 'left', 'left', 'center', 'right', 'right', 'right', 'right', 'left', 'left']
    fields = ['', 'id', 'destination', 'route', 'customer', 'pickupPoint', 'time', 'adults', 'kids', 'free', 'totalPersons', 'driver', 'port']

    mustRefresh: boolean = true

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    // #endregion

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private interactionTransferService: InteractionTransferService, private service: TransferService, private snackBar: MatSnackBar) {
        this.activatedRoute.params.subscribe((params: Params) => this.dateIn = params['dateIn'])
        this.router.events.subscribe((navigation: any) => {
            if (navigation instanceof NavigationEnd && this.dateIn != '' && this.router.url.split('/').length == 4) {
                this.mustRefresh = true
                this.loadTransfers()
                if (this.queryResult.persons == 0) {
                    this.showNoDataSnackbar()
                }
            }
        })
    }

    ngOnInit() {
        this.initPersonsSumArray()
        this.subscribeToInderactionService()
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
        this.setTableStatus()
    }

    ngAfterViewChecked() {
        if (this.queryResult.persons != 0)
            document.getElementById('summaries').style.height = document.getElementById('listFormCombo').offsetHeight - document.getElementById("totals").offsetHeight - 16 + 'px'
    }

    ngDoCheck() {
        if (this.mustRefresh) {
            this.mustRefresh = false
            this.ngAfterViewInit()
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.unsubscribe();
        this.unlisten && this.unlisten()
    }

    /**
     * Caller(s):
     *  Template - toggleItem()
     * 
     * Description: 
     *  Adds / removes the class 'activeItem' to / from the clicked item 
     *  Adds / removes the item to / from the lookupArray
     *  Filters the list according to the selected items
     *  Updates the transfersFlat array 
     * 
     * @param item // The element that was clicked
     * @param lookupArray // The array that the element belongs to
     */
    toggleItem(item: any, lookupArray: string) {
        this.toggleActiveItem(item, lookupArray)
        this.initCheckedPersons()
        this.filterByCriteria()
        this.updateTotals()
        this.flattenResults()
        this.saveToLocalStorage()
    }

    /**
     * Caller(s):
     *  Template - toggleItems()
     * 
     * Description:
     *  It stops the panel's default behavior to expand or collapse
     *  Clears all items from the lookupArray
     *  Calls 'selectItems' method to either select or deselect all items
     *  Calls 'filterByCriteria()' 
     *  Calls 'flattenResults()'
     * 
     * @param lookupArray // The array that must fill or empty
     */
    toggleItems(className: string, lookupArray: { splice: (arg0: number) => void; }, checkedArray: any) {
        event.stopPropagation()
        lookupArray.splice(0)
        this.selectItems(className, lookupArray, !checkedArray)
        this.filterByCriteria()
        this.initCheckedPersons()
        this.updateTotals()
        this.flattenResults()
    }

    /**
     * Caller(s):
     *  Class - addActiveClassToSelectedArrays()
     * 
     * Description:
     *  Adds the class 'activeItem' to the element if it's part of the lookupArray
     * 
     * @param className // The items with this class
     * @param lookupArray // The array with the selected items
     */
    private addActiveClassToElements(className: string, lookupArray: string[]) {
        let elements = document.querySelectorAll(className)
        elements.forEach((element) => {
            let position = lookupArray.indexOf(element.id)
            if (position >= 0) {
                element.classList.add('activeItem')
            }
        })
    }

    /**
     * Caller(s):
     *  Class - ngAfterViewInit()
     * 
     * Description:
     *  Calls the 'addActiveClassToElements()' for every summary group
     */
    private addActiveClassToSelectedArrays() {
        setTimeout(() => {
            this.addActiveClassToElements('.item.destination', this.selectedDestinations)
            this.addActiveClassToElements('.item.customer', this.selectedCustomers)
            this.addActiveClassToElements('.item.route', this.selectedRoutes)
            this.addActiveClassToElements('.item.driver', this.selectedDrivers)
            this.addActiveClassToElements('.item.port', this.selectedPorts)
        }, 100);
    }

    /**
     * Caller(s):
     *  Class - subscribeToInderactionService()
     * 
     * Description:
     *  Self-explanatory
     * 
     * @param id 
     */
    private editRecord(id: number) {
        this.navigateToEditRoute(id)
    }

    /**
     * Caller(s): 
     *  Class - ngAfterViewInit(), toggleItem(), toggleItems()
     * 
     * Description:
     *  Stores the data from the initial read to the queryResultClone array
     *  Filters the queryResultClone array according to the selected items
     */
    private filterByCriteria() {
        this.queryResultClone.transfers = this.queryResult.transfers
            .filter((destination: { destination: { description: string } }) => { return this.selectedDestinations.indexOf(destination.destination.description) != -1 })
            .filter((customer: { customer: { description: string } }) => { return this.selectedCustomers.indexOf(customer.customer.description) != -1 })
            .filter((route: { pickupPoint: { route: { abbreviation: string } } }) => { return this.selectedRoutes.indexOf(route.pickupPoint.route.abbreviation) != -1 })
            .filter((driver: { driver: { description: string } }) => { return this.selectedDrivers.indexOf(driver.driver.description) != -1 })
            .filter((port: { pickupPoint: { route: { port: { description: string } } } }) => { return this.selectedPorts.indexOf(port.pickupPoint.route.port.description) != -1 })
    }

    /**
     * Caller(s):
     *  Class - loadTransfers()
     *  Class - toggleItem()
     *  Class - toggleItems()
     * 
     * Description: 
     *  Flattens the queryResultClone array and populates the transfersFlat array with its output
     *  The transfersFlat array will be the input for the table on the template
     */
    private flattenResults() {
        this.transfersFlat.splice(0)
        for (var {
            id: a,
            destination: { abbreviation: b },
            customer: { description: c },
            adults: d,
            kids: e,
            free: f,
            totalPersons: g,
            pickupPoint: { description: h, time: i, route: { abbreviation: j, port: { description: k } } },
            driver: { description: l },
            userName: m,
            dateIn: n,
            remarks: o
        } of this.queryResultClone.transfers) {
            this.transfersFlat.push({ id: a, destination: b, customer: c, adults: d, kids: e, free: f, totalPersons: g, pickupPoint: h, time: i, route: j, port: k, driver: l, userName: m, dateIn: n, remarks: o })
        }
    }

    /**
     * Caller(s):
     *  Class - ngAfterViewInit()
     * 
     * Description:
     *  Checks if localStorage has any data
     */
    private isDataInLocalStorage() {
        return localStorage.getItem('transfers')
    }

    /**
     * Caller(s):
     *  Class - constructor()
     * 
     * Description:
     *  Loads the records from the api for the given date
     */
    private loadTransfers() {
        this.queryResult = this.activatedRoute.snapshot.data['transferList']
    }

    /**
     * Caller(s):
     *  Class - editRecord()
     * 
     * Description:
     *  Navigates to the edit route
     * 
     * @param id 
     */
    private navigateToEditRoute(id: number) {
        this.router.navigate(['transfer/', id], { relativeTo: this.activatedRoute })
    }

    /**
     * Caller(s):
     *  Class - ngAfterViewInit(), toggleItems()
     * 
     * Description:
     *  Saves the selected items in the localStorage
     */
    private saveToLocalStorage() {
        let summaryItems = {
            "destinations": JSON.stringify(this.selectedDestinations),
            "customers": JSON.stringify(this.selectedCustomers),
            "routes": JSON.stringify(this.selectedRoutes),
            "drivers": JSON.stringify(this.selectedDrivers),
            "ports": JSON.stringify(this.selectedPorts),
        }
        localStorage.setItem('transfers', JSON.stringify(summaryItems))
        localStorage.removeItem('selectedIds')
    }

    /**
     * Caller(s): 
     *  Class - toggleItems()
     *  Template - toggleItems()
     * 
     * Description:
     *  According to the checked = true / false
     *  Toggles the class 'activeItem' for every item in the given className
     *  Adds / removes all items to / from the lookupArray
     * 
     * @param className 
     * @param lookupArray 
     * @param checked 
     */
    private selectItems(className: string, lookupArray: any, checked: boolean) {
        let elements = document.getElementsByClassName('item ' + className)
        for (let index = 0; index < elements.length; index++) {
            const element = elements[index]
            if (checked) {
                element.classList.add('activeItem')
                eval(lookupArray).push(element.id)
            } else {
                element.classList.remove('activeItem')
            }
        }
    }

    /**
     * Caller(s): 
     *  Class - ngOnInit()
     * 
     * Description:
     *  Gets the selected record from the table through the service and executes the editRecord method
     *  Refreshes the list after a new record has been added
     */
    private subscribeToInderactionService() {
        this.interactionTransferService.record.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.editRecord(response['id'])
        })
        this.interactionTransferService.refreshList.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            this.service.getTransfers(this.dateIn).subscribe(result => {
                this.queryResult = result
                this.ngAfterViewInit()
            })
        })
    }

    /**
     * Caller(s):
     *  Class - ngAfterViewInit()
     * 
     * Description:
     *  Stores the data from the initial result to the arrays
     * 
     */
    private updateSelectedArraysFromInitialResults() {
        this.queryResult.personsPerDestination.forEach((element: { description: string; }) => { this.selectedDestinations.push(element.description) })
        this.queryResult.personsPerCustomer.forEach((element: { description: string; }) => { this.selectedCustomers.push(element.description) })
        this.queryResult.personsPerRoute.forEach((element: { description: string; }) => { this.selectedRoutes.push(element.description) })
        this.queryResult.personsPerDriver.forEach((element: { description: string; }) => { this.selectedDrivers.push(element.description) })
        this.queryResult.personsPerPort.forEach((element: { description: string; }) => { this.selectedPorts.push(element.description) })
    }

    /**
     * Caller(s):
     *  Class - ngAfterViewInit()
     * 
     * Description:
     *  Stores the data from the localStorage to the arrays
     */
    private updateSelectedArraysFromLocalStorage() {
        let localStorageData = JSON.parse(localStorage.getItem('transfers'))
        this.selectedDestinations = JSON.parse(localStorageData.destinations)
        this.selectedCustomers = JSON.parse(localStorageData.customers)
        this.selectedRoutes = JSON.parse(localStorageData.routes)
        this.selectedDrivers = JSON.parse(localStorageData.drivers)
        this.selectedPorts = JSON.parse(localStorageData.ports)
    }

    /**
     * Caller(s):
     *  Class - ngAfterViewInit()
     * 
     * Description:
     *  Sends true or false to the service so that the wrapper can decide whether to display the 'Assing driver' button or not
     */
    private setTableStatus() {
        this.interactionTransferService.setTableStatus(!!this.queryResult.persons)
    }

    /**
     * Caller(s):
     *  Class - ngAfterViewInit()
     *  Class - toggleItem()
     *  Class - toggleItems()
     * 
     * Description:
     *  Populates the array with the total persons displayed in the template
     */
    private updateTotals() {
        this.totals[0].sum = this.queryResult.persons
        this.totals[1].sum = this.queryResultClone.transfers.reduce((sum: any, array: { totalPersons: any; }) => sum + array.totalPersons, 0);
        this.interactionTransferService.checked.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => { this.totals[2].sum = result })
    }

    /**
     * Caller(s):
     *  Class - ngAfterViewInit()
     *  Class - toggleItem()
     *  Class - toggleItems()
     * 
     * Description:
     *  Sets checked persons to zero
     */
    private initCheckedPersons() {
        this.interactionTransferService.setCheckedTotalPersons(0)
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
     * 
     * Description:
     *  Prepare the array of totals
     */
    private initPersonsSumArray() {
        this.totals.push(
            { description: 'ALL', sum: 0 },
            { description: 'DISPLAYED', sum: 0 },
            { description: 'CHECKED', sum: 0 }
        )
    }

    /**
     * Caller(s):
     *  Class - toggleItem()
     * 
     * Description:
     *  Toggles activeItem class to the clicked item and updates the array with all the selected
     * 
     * @param item 
     * @param lookupArray 
     */
    private toggleActiveItem(item: { description: string; }, lookupArray: string) {
        var element = document.getElementById(item.description)
        if (element.classList.contains('activeItem')) {
            for (var i = 0; i < eval(lookupArray).length; i++) {
                if (eval(lookupArray)[i] == item.description) {
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
    }

    /**
     * Caller(s):
     *  Class - constructor
     * 
     * Description:
     *  Self-explanatory
     */
    private showNoDataSnackbar(): void {
        this.snackBar.open('We found nothing for this date', 'Close', {
            duration: 3000,
            panelClass: ['danger']
        })
        this.focus('dateIn')
    }

    /**
     * Caller(s):
     *  Class - showNoDataSnackbar()

     * Description:
     *  Calls the public method()
     * 
     * @param field 
     */
    private focus(field: string): void {
        Utils.setFocus(field)
    }

}
