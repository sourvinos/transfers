import { Component, OnDestroy, OnInit } from '@angular/core';
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

export class ListTransferComponent implements OnInit, OnDestroy {

    // #region Init

    dateIn: string
    currentDate: string
    localStorageData: any = ''

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

    headers = ['Id', 'Dest', 'Route', 'Customer', 'Pickup point', 'Time', 'A', 'K', 'F', 'T', 'Driver', 'Port']
    widths = ['100px', '50px', '100px', '200px', '200px', '60px', '40px', '40px', '40px', '40px', '100px', '100px']
    visibility = ['none', '', '', '', '', '', '', '', '', '', '', '']
    justify = ['center', 'center', 'center', 'left', 'left', 'center', 'right', 'right', 'right', 'right', 'left', 'left']
    fields = ['id', 'destination', 'route', 'customer', 'pickupPoint', 'time', 'adults', 'kids', 'free', 'totalPersons', 'driver', 'port']

    unlisten: Unlisten
    navigationSubscription: any
    ngUnsubscribe = new Subject<void>();

    // #endregion

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private transferInteractionService: InteractionTransferService) {
        this.activatedRoute.params.subscribe((params: Params) => this.dateIn = params['dateIn'])
        this.navigationSubscription = this.router.events.subscribe((navigation: any) => {
            if (navigation instanceof NavigationEnd && this.dateIn != '' && this.router.url.split('/').length == 4) {
                this.loadTransfers()
            }
        })
    }

    ngOnInit() {
        this.subscribeToInderactionService()
    }

    ngAfterViewInit() {
        // If localStorage has data
        if (JSON.parse(localStorage.getItem('transfers'))) {
            // Populate the arrays from the localStorage
            this.localStorageData = JSON.parse(localStorage.getItem('transfers'))
            console.log('localStorage has data', this.localStorageData.destinations)
            this.selectedDestinations = JSON.parse(this.localStorageData.destinations)
            this.selectedCustomers = JSON.parse(this.localStorageData.customers)
            this.selectedRoutes = JSON.parse(this.localStorageData.routes)
            this.selectedDrivers = JSON.parse(this.localStorageData.drivers)
            this.selectedPorts = JSON.parse(this.localStorageData.ports)
            console.log('selected destinations', this.selectedDestinations)
        } else {
            // Populate the arrays from the results of the queryResult
            console.log('localStorage is empty')
            this.queryResult.personsPerDestination.forEach((element: { description: string; }) => { this.selectedDestinations.push(element.description) })
            this.queryResult.personsPerCustomer.forEach((element: { description: string; }) => { this.selectedCustomers.push(element.description) })
            this.queryResult.personsPerRoute.forEach((element: { description: string; }) => { this.selectedRoutes.push(element.description) })
            this.queryResult.personsPerDriver.forEach((element: { description: string; }) => { this.selectedDrivers.push(element.description) })
            this.queryResult.personsPerPort.forEach((element: { description: string; }) => { this.selectedPorts.push(element.description) })
            console.log('selected destinations', this.selectedDestinations)
            // Save
            let summaryItems = {
                "destinations": JSON.stringify(this.selectedDestinations),
                "customers": JSON.stringify(this.selectedCustomers),
                "routes": JSON.stringify(this.selectedRoutes),
                "drivers": JSON.stringify(this.selectedDrivers),
                "ports": JSON.stringify(this.selectedPorts),
            }
            localStorage.setItem('transfers', JSON.stringify(summaryItems))
            this.localStorageData = JSON.parse(localStorage.getItem('transfers'))
            // Populate the arrays from the localStorage
            this.selectedDestinations = JSON.parse(this.localStorageData.destinations)
            this.selectedCustomers = JSON.parse(this.localStorageData.customers)
            this.selectedRoutes = JSON.parse(this.localStorageData.routes)
            this.selectedDrivers = JSON.parse(this.localStorageData.drivers)
            this.selectedPorts = JSON.parse(this.localStorageData.ports)
        }
        this.addActiveClassToElements('.item.destination', this.selectedDestinations)
        this.addActiveClassToElements('.item.customer', this.selectedCustomers)
        this.addActiveClassToElements('.item.route', this.selectedRoutes)
        this.addActiveClassToElements('.item.driver', this.selectedDrivers)
        this.addActiveClassToElements('.item.port', this.selectedPorts)
        this.filterByCriteria()
        this.flattenResults()
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.unsubscribe();
        this.navigationSubscription.unsubscribe()
        this.unlisten && this.unlisten()
        this.clearLocalStorage()
    }

    /**
     * Caller:
     *  Template - toggleItem()
     * 
     * Description: 
     *  Adds / removes the class 'activeItem' to / from the clicked item 
     *  Adds / removes the item to / from the lookupArray
     *  Filters the list according to the selected items
     *  Updates the transfersFlat array 
     * 
     * @param item 
     * @param lookupArray 
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
        let summaryItems = {
            "destinations": JSON.stringify(this.selectedDestinations),
            "customers": JSON.stringify(this.selectedCustomers),
            "routes": JSON.stringify(this.selectedRoutes),
            "drivers": JSON.stringify(this.selectedDrivers),
            "ports": JSON.stringify(this.selectedPorts),
        }
        localStorage.setItem('transfers', JSON.stringify(summaryItems))
        console.log('localStorage updated')
    }

    /**
     * Caller:
     *  Template - toggleItems()
     * Description:
     *  It stops the panel's default behavior to expand or collapse
     *  Clears all items from the lookupArray
     *  Calls 'selectItems' method to either select or deselect all items
     *  Calls 'filterByCriteria()' 
     *  Calls 'flattenResults()'
     * 
     * @param lookupArray 
     */
    toggleItems(className: string, lookupArray: { splice: (arg0: number) => void; }, checkedArray: any) {
        event.stopPropagation()
        lookupArray.splice(0)
        this.selectItems(className, lookupArray, !checkedArray)
        this.filterByCriteria()
        this.flattenResults()
    }

    /**
     * Caller:
     *  Class - constructor()
     * Description:
     *  Gets the records from the api for the given date
     */
    private loadTransfers() {
        this.queryResult = this.activatedRoute.snapshot.data['transferList']
        this.queryResultClone = JSON.parse(JSON.stringify(this.queryResult))
        console.clear()
        console.log('1. loadTransfers - queryResult', this.queryResult.persons, 'queryResultClone', this.queryResultClone.persons)
    }

    /**
     * Caller: 
     *  Class - constructor(), toggleItem(), toggleItems()
     * Description:
     *  Stores the data from the api to the queryResultClone array
     *  Filters the queryResultClone array according to the selected items
     */
    private filterByCriteria() {
        this.queryResultClone = JSON.parse(JSON.stringify(this.queryResult))
        this.queryResultClone.transfers = this.queryResultClone.transfers
            .filter((x: { destination: { description: string } }) => { return this.selectedDestinations.indexOf(x.destination.description) != -1 })
            .filter((y: { customer: { description: string } }) => { return this.selectedCustomers.indexOf(y.customer.description) != -1 })
            .filter((z: { pickupPoint: { route: { abbreviation: string } } }) => { return this.selectedRoutes.indexOf(z.pickupPoint.route.abbreviation) != -1 })
            .filter((o: { driver: { description: string } }) => { return this.selectedDrivers.indexOf(o.driver.description) != -1 })
            .filter((p: { port: { description: string } }) => { return this.selectedPorts.indexOf(p.port.description) != -1 })
    }

    /**
     * Caller: 
     *  Class - selectGroupItems()
     *  Template - toggleItems()
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
     * Caller:
     *  Class - loadTransfers()
     *  Class - toggleItem()
     *  Class - toggleItems()
     * Description: 
     *  Flattens the queryResultClone array and populates the transfersFlat array with its output
     *  This is the last step of the filtering process
     *  The transfersFlat array will be the input for the table on the template
     */
    private flattenResults() {
        console.log('7. flattenResults')
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
        console.log('7. this.queryResultClone', this.queryResultClone.length)
        console.log('7. this.transfersFlat', this.transfersFlat.length)
    }

    /**
     * Caller: 
     *  Class - ngOnInit()
     * Description:
     *  Gets the selected record from the table through the interaction service and executes the editRecord method
     */
    private subscribeToInderactionService() {
        this.transferInteractionService.data.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.editRecord(response[0]['id'])
        })
    }

    /**
     * Caller: 
     *  Class - onDestroy()
     * Description:
     *  Deletes the localStorage data on navigation away from this page
     */
    private clearLocalStorage() {
        localStorage.removeItem('transfers')
    }

    /**
      * Caller:
      *  Class - subscribeToInderactionService()
      * Description:
      *  Saves the selected items to the localStorage
      *  Calls the navigateToEditRoute()
      * 
      * @param id 
      */
    private editRecord(id: number) {
        // this.saveSelectedItemsToLocalStorage(true)
        this.navigateToEditRoute(id)
    }

    /**
     * Caller:
     *  Class - editRecord()
     * Description:
     *  Navigates to the edit route
     * 
     * @param id 
     */
    private navigateToEditRoute(id: number) {
        this.router.navigate(['transfer/', id], { relativeTo: this.activatedRoute })
    }

    private addActiveClassToElements(className: string, lookupArray: string[]) {
        let elements = document.querySelectorAll(className)
        elements.forEach((element) => {
            let position = lookupArray.indexOf(element.id)
            if (position >= 0) {
                element.classList.add('activeItem')
            }
        })
    }

}
