import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { KeyboardShortcuts, Unlisten } from '../../services/keyboard-shortcuts.service';
import { Utils } from '../../shared/classes/utils';
import { ICustomer } from '../classes/model-customer';
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'list-customer',
    templateUrl: './list-customer.html',
    styleUrls: ['../../shared/styles/lists.css']
})

export class CustomerListComponent implements OnInit, OnDestroy {

    // #region Init

    customers: ICustomer[]
    filteredCustomers: ICustomer[]

    headers = ['Id', 'Description', 'Phones', 'Email']
    widths = ['0px', '50%', '25%', '25%']
    visibility = ['none', '', '', '']
    justify = ['center', 'left', 'left', 'left']
    fields = ['id', 'description', 'phones', 'email']

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    // #endregion Init

    constructor(private activatedRoute: ActivatedRoute, private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private route: ActivatedRoute, private baseInteractionService: BaseInteractionService) {
        this.customers = this.route.snapshot.data['customerList']
        this.filteredCustomers = this.customers
    }

    ngOnInit() {
        this.addShortcuts()
        this.setFocus('searchField')
        this.subscribeToInteractionService()
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten && this.unlisten()
    }

    private loadCustomers() {
        this.customers = this.activatedRoute.snapshot.data['customers']
        console.log(this.customers)
    }

    // T
    editRecord(id: number) {
        this.navigateToEditRoute(id)
    }

    // T
    filter(query: string) {
        this.filteredCustomers = query ? this.customers.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.customers
    }

    // T
    newRecord() {
        this.router.navigate(['/customers/new'])
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

    private setFocus(element: string) {
        Utils.setFocus(element)
    }

    /**
     * Caller(s): 
     *  Class - ngOnInit()
     * 
     * Description:
     *  Gets the selected record from the table through the service and executes the editRecord method
     *  Refreshes the list after a new record has been added
     */
    private subscribeToInteractionService() {
        this.baseInteractionService.record.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.editRecord(response['id'])
        })
    }

    private navigateToEditRoute(id: number) {
        this.router.navigate(['/destinations', id])
    }

}
