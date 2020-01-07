import { AfterViewInit, Component, OnDestroy, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Unlisten } from 'src/app/services/keyboard-shortcuts.service';
import { ITransferFlat } from '../classes/model-transfer-flat';
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

    unlisten: Unlisten
    navigationSubscription: any
    ngUnsubscribe = new Subject<void>();
    mustRefresh: boolean = true

    // #endregion

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private interactionTransferService: InteractionTransferService) {
        this.activatedRoute.params.subscribe((params: Params) => this.dateIn = params['dateIn'])
        this.navigationSubscription = this.router.events.subscribe((navigation: any) => {
            if (navigation instanceof NavigationEnd && this.dateIn != '' && this.router.url.split('/').length == 4) {
                this.mustRefresh = true
                this.loadTransfers()
            }
        })
    }

    ngOnInit() {
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
        this.flattenResults()
        this.setTableStatus()
    }

    ngAfterViewChecked() {
        document.getElementById('summaries').style.height = document.getElementById('listFormCombo').offsetHeight + 'px'
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
        this.navigationSubscription.unsubscribe()
        this.unlisten && this.unlisten()
        this.clearLocalStorage()
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
        this.filterByCriteria()
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
        }, 500);
    }

    /**
     * Caller(s): 
     *  Class - onDestroy()
     * 
     * Description:
     *  Deletes the localStorage data on navigation away from this page
     */
    private clearLocalStorage() {
        localStorage.removeItem('transfers')
    }

    /**
     * Caller(s):
     *  Class - subscribeToInderactionService()
     * 
     * Description:
     *  Saves the selected items to the localStorage
     *  Calls the navigateToEditRoute()
     * 
     * @param id 
     */
    private editRecord(id: number) {
        // this.saveToLocalStorage()
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
            .filter((x: { destination: { description: string } }) => { return this.selectedDestinations.indexOf(x.destination.description) != -1 })
            .filter((y: { customer: { description: string } }) => { return this.selectedCustomers.indexOf(y.customer.description) != -1 })
            .filter((z: { pickupPoint: { route: { abbreviation: string } } }) => { return this.selectedRoutes.indexOf(z.pickupPoint.route.abbreviation) != -1 })
            .filter((o: { driver: { description: string } }) => { return this.selectedDrivers.indexOf(o.driver.description) != -1 })
            .filter((p: { port: { description: string } }) => { return this.selectedPorts.indexOf(p.port.description) != -1 })
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
            pickupPoint: { description: h, time: i, route: { abbreviation: j } },
            port: { description: k },
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
     * 
     */
    private subscribeToInderactionService() {
        this.interactionTransferService.record.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.editRecord(response['id'])
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

    private setTableStatus() {
        this.interactionTransferService.setTableStatus(!!this.queryResult.persons)
    }

}
