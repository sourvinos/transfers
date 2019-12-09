import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
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

    transfersFlat: ITransferFlat[] = []

    headers = ['Id', 'Dest', 'Route', 'Customer', 'Pickup point', 'Time', 'A', 'K', 'F', 'T', 'Driver', 'Port']
    widths = ['100px', '50px', '100px', '200px', '200px', '60px', '40px', '40px', '40px', '40px', '100px', '100px']
    visibility = ['', '', '', '', '', '', '', '', '', '', '', '']
    justify = ['center', 'center', 'center', 'left', 'left', 'center', 'right', 'right', 'right', 'right', 'left', 'left']
    fields = ['id', 'destination', 'route', 'customer', 'pickupPoint', 'time', 'adults', 'kids', 'free', 'totalPersons', 'driver', 'port']

    navigationSubscription: any

    // #endregion

    constructor(private keyboardShortcutsService: KeyboardShortcuts, private activatedRoute: ActivatedRoute, private router: Router, private transferService: TransferService, private interactionService: InteractionService) {
        this.activatedRoute.params.subscribe((params: Params) => { this.dateIn = params['dateIn'] })
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd && this.dateIn != '') {
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
     * Adds or removes the class 'activeItem' for the selected item (item)
     * Adds or removes the item to the array of selected items (lookupArray)
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
     * Clears all items from the selected array (lookupArray)
     * Calls the 'selectItems' method
     * @param lookupArray 
     */
    toggleItems(className: string, lookupArray: { splice: (arg0: number) => void; }, checkedArray: any) {
        // console.log('1/4 toggleItems')
        event.stopPropagation()
        lookupArray.splice(0)
        this.selectItems(className, lookupArray, !checkedArray)
        this.filterByCriteria()
        this.flattenResults()
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
        this.router.navigate(['transfer/', id], { relativeTo: this.activatedRoute })
    }

    /**
     * Called from the constructor on every page refresh and if the given date is valid
     */
    private loadTransfers() {
        // console.log('loadTransfers')
        this.transferService.getTransfers(this.dateIn).subscribe((result: any) => {
            this.queryResult = result
            this.queryResultClone = JSON.parse(JSON.stringify(this.queryResult))
            this.flattenResults()
        })
    }

    /**
     * Called on item click from toggleItem() and
     * after checkbox click from toggleItems()
     */
    private filterByCriteria() {
        // console.log('3/4 filterByCriteria')
        // console.log('3/4', this.selectedDestinations)
        // console.log('3/4', this.selectedCustomers)
        // console.log('3/4', this.selectedRoutes)
        // console.log('3/4', this.selectedDrivers)
        // console.log('3/4', this.selectedPorts)
        this.queryResultClone = JSON.parse(JSON.stringify(this.queryResult))
        this.queryResultClone.transfers = this.queryResultClone.transfers
            .filter((x: { destination: { description: string } }) => { return this.selectedDestinations.indexOf(x.destination.description) != -1 })
            .filter((y: { customer: { description: string } }) => { return this.selectedCustomers.indexOf(y.customer.description) != -1 })
            .filter((z: { pickupPoint: { route: { abbreviation: string } } }) => { return this.selectedRoutes.indexOf(z.pickupPoint.route.abbreviation) != -1 })
            .filter((o: { driver: { description: string } }) => { return this.selectedDrivers.indexOf(o.driver.description) != -1 })
            .filter((p: { port: { description: string } }) => { return this.selectedPorts.indexOf(p.port.description) != -1 })
        // console.log('Results', this.queryResult)
        // console.log('Cloned results', this.queryResultClone)
        // console.log('Filtered Transfers', this.queryResultClone.transfers)
    }

    /**
     * Called on every page refresh for all summary filters
     */
    private selectGroupItems() {
        // console.log('selectGroupItems')
        setTimeout(() => {
            this.selectItems('item destination', this.selectedDestinations, true)
            this.selectItems('item customer', this.selectedCustomers, true)
            this.selectItems('item route', this.selectedRoutes, true)
            this.selectItems('item driver', this.selectedDrivers, true)
            this.selectItems('item port', this.selectedPorts, true)
        }, 500);
    }

    /**
     * Called on page refresh and on checkbox click
     * According to the (checked = true / false) does the following:
     * Adds or removes the class 'activeItem' for every item (className)
     * Adds or removes all the items to the array of selected items (lookupArray)
     * @param className 
     * @param lookupArray 
     * @param checked 
     */
    private selectItems(className: string, lookupArray: any, checked: boolean) {
        // console.log('2/4 selectItems')
        let elements = document.getElementsByClassName(className)
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
     * Flattens the queryResultClone array and populates the transfersFlat array with its output
     * The transfersFlat  will be input for the table on the template
     */
    private flattenResults() {
        // console.log('4/4 flattenResults')
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
        this.interactionService.data.subscribe(response => {
            this.editRecord(response['id'])
        })
    }

}
