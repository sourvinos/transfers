import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ITransferFlat } from 'src/app/models/transfer-flat';
import { KeyboardShortcuts, Unlisten } from 'src/app/services/keyboard-shortcuts.service';
import { Utils } from 'src/app/shared/classes/utils';
import { InteractionService } from 'src/app/shared/services/interaction.service';
import { TransferService } from '../classes/service-api-transfer';

@Component({
    selector: 'app-transfer-list',
    templateUrl: './list-transfer.html',
    styleUrls: ['./list-transfer.css']
})

export class TransferListComponent implements OnInit {

    // #region Init

    dateIn: string
    currentDate: string

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

    unlisten: Unlisten
    value: any

    transfersFlat: ITransferFlat[] = []

    headers = ['Id', 'Dest', 'Route', 'Customer', 'Pickup point', 'Time', 'A', 'K', 'F', 'T', 'Driver', 'Port']
    widths = ['100px', '50px', '100px', '200px', '200px', '60px', '40px', '40px', '40px', '40px', '100px', '100px']
    visibility = ['none', '', '', '', '', '', '', '', '', '', '', '']
    justify = ['center', 'center', 'center', 'left', 'left', 'center', 'right', 'right', 'right', 'right', 'left', 'left']
    fields = ['id', 'destination', 'route', 'customer', 'pickupPoint', 'time', 'adults', 'kids', 'free', 'totalPersons', 'driver', 'port']

    navigationSubscription: any

    ngUnsubscribe = new Subject<void>();

    // #endregion

    constructor(private keyboardShortcutsService: KeyboardShortcuts, private activatedRoute: ActivatedRoute, private router: Router, private transferService: TransferService, private interactionService: InteractionService) {
        this.activatedRoute.params.subscribe((params: Params) => this.dateIn = params['dateIn'])
        this.navigationSubscription = this.router.events.subscribe((navigation: any) => {
            if (navigation instanceof NavigationEnd && this.dateIn != '') {
                this.loadTransfers()
                this.selectGroupItems()
            }
        })
    }

    ngOnInit() {
        this.addShortcuts()
        this.subscribeToInderactionService()
    }

    /**
     * Called from the template on every summary item click
     * Adds / removes the class 'activeItem' to / from the selected item 
     * Adds / removes the item to / from the lookupArray
     * Filters the list according to the selected items
     * Updates the transfersFlat array 
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
    }

    /**
     * Called from the template on every checkbox click
     * It stops the panel's default behavior to expand or collapse
     * Clears all items from the lookupArray
     * Calls 'selectItems' method to either select or deselect all items
     * Calls 'filterByCriteria' 
     * Calls 'flattenResults'
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
     * Called from the constructor on every page refresh
     */
    private loadTransfers() {
        this.transferService.getTransfers(this.dateIn).subscribe((result: any) => {
            this.queryResult = result
            this.queryResultClone = JSON.parse(JSON.stringify(this.queryResult))
            this.flattenResults()
        })
    }

    /**
     * Called from 'toggleItem' on item click 
     * Called from 'toggleItems' on checkbox click
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
     * Called from the constructor on every page refresh
     */
    private selectGroupItems() {
        setTimeout(() => {
            this.selectItems('item destination', this.selectedDestinations, true)
            this.selectItems('item customer', this.selectedCustomers, true)
            this.selectItems('item route', this.selectedRoutes, true)
            this.selectItems('item driver', this.selectedDrivers, true)
            this.selectItems('item port', this.selectedPorts, true)
        }, 1000);
    }

    /**
     * Called from selectGroupItems and on checkbox click
     * According to the checked = true / false
     * Toggles the class 'activeItem' for every item with the given className
     * Adds / removes all items to / from the lookupArray
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
     * Called from toggleItems(T), loadTransfers(L), toggleItem(L)
     * Flattens the queryResultClone array and populates the transfersFlat array with its output
     * This is the last step of the filtering process
     * The transfersFlat array will be the input for the table on the template
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

    private setFocus(field: string) {
        Utils.setFocus(field)
    }

    private subscribeToInderactionService() {
        this.interactionService.data.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.editRecord(response['id'])
        })
    }

    private saveSelectedSummaryItemsToLocalStorage() {
        let summaryItems = {
            "destinations": JSON.stringify(this.selectedDestinations),
            "customers": JSON.stringify(this.selectedCustomers),
            "routes": JSON.stringify(this.selectedRoutes),
            "drivers": JSON.stringify(this.selectedDrivers),
            "ports": JSON.stringify(this.selectedPorts),
        }
        localStorage.setItem('transfers', JSON.stringify(summaryItems))
    }

    private navigateToEditRoute(id: number) {
        this.router.navigate(['transfer/', id], { relativeTo: this.activatedRoute })
    }

    private removeAllSummaryItemsFromLocalStorage() {
        localStorage.removeItem('transfers')
    }

    private addActiveClassToItems(array: any[], className: string) {
        let elements = document.querySelectorAll('.item' + '.' + className)
        elements.forEach((element: HTMLElement) => {
            let position = array.indexOf(element.id)
            if (position != -1) {
                document.getElementById(element.id).classList.add('activeItem')
            }
        })
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            "Alt.F": (event: KeyboardEvent): void => {
                event.preventDefault()
                this.setFocus('searchField')
            },
            "Alt.N": (event: KeyboardEvent): void => {
                event.preventDefault()
                document.getElementById('new').click()
            }
        }, {
            priority: 1,
            inputs: true
        })
    }

    private disableFields(fields: string[]) {
        Utils.disableFields(fields)
    }

    private editRecord(id: number) {
        this.navigateToEditRoute(id)
    }

}
