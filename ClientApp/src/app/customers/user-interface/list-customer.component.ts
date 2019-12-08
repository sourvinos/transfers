import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InteractionService } from 'src/app/shared/services/interaction.service';
import { KeyboardShortcuts, Unlisten } from '../../services/keyboard-shortcuts.service';
import { Utils } from '../../shared/classes/utils';
import { ICustomer } from '../classes/model-customer';

@Component({
    selector: 'list-customer',
    templateUrl: './list-customer.component.html',
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

    // #endregion

    constructor(private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private route: ActivatedRoute, private interactionService: InteractionService) {
        this.customers = this.route.snapshot.data['customerList']
        this.filteredCustomers = this.customers
        this.unlisten = null
    }

    ngOnInit() {
        this.addShortcuts()
        this.setFocus('searchField')
        this.subscribeToInderactionService()
    }

    ngOnDestroy() {
        this.unlisten && this.unlisten();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    // T
    editRecord(id: number) {
        this.router.navigate(['/customers/', id])
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

    private subscribeToInderactionService() {
        this.interactionService.data.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            console.log('list-customer', response)
            this.editRecord(response['id'])
        })
    }

}
