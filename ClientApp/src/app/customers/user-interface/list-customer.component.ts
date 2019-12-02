import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeyboardShortcuts, Unlisten } from '../../services/keyboard-shortcuts.service';
import { Utils } from '../../shared/classes/utils';
import { ICustomer } from '../classes/model-customer';
import { InteractionService } from 'src/app/shared/services/interaction.service';
import { TableComponent } from 'src/app/shared/components/table/table.component';

@Component({
    selector: 'list-customer',
    templateUrl: './list-customer.component.html',
    styleUrls: ['../../shared/styles/lists.css']
})

export class CustomerListComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Init

    customers: ICustomer[]
    filteredCustomers: ICustomer[]

    headers = ['Id', 'Description', 'Phones', 'Email']
    widths = ['0px', '0px', '400px', '400px']
    visibility = ['none', '', '', '']
    justify = ['center', 'left', 'left', 'left']
    fields = ['id', 'description', 'phones', 'email']

    unlisten: Unlisten

    // #endregion

    @ViewChild(TableComponent) private varName: TableComponent

    constructor(private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private route: ActivatedRoute, private interactionService: InteractionService) {
        this.customers = this.route.snapshot.data['customerList']
        this.filteredCustomers = this.customers
        this.unlisten = null
    }

    ngOnInit() {
        this.addShortcuts()
        this.setFocus('searchField')
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.gotoLastKnownRow()
        }, 100);
    }

    ngOnDestroy() {
        this.deleteIdFromLocalStorage()
        this.unlisten && this.unlisten()
    }

    // T
    editRecord() {
        this.router.navigate(['/customers/', document.querySelector('tr.selected').children[0].textContent])
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
            "Enter": (): void => {
                this.editRecord()
            },
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

    private gotoLastKnownRow() {
        let id = localStorage.getItem('id')
        if (id) {
            let item = document.getElementsByClassName(id)[0].id
            this.varName.gotoRow(item)
        }
    }

    private setFocus(element: string) {
        Utils.setFocus(element)
    }

    private deleteIdFromLocalStorage() {
        localStorage.setItem('id', '')
    }

    startTimer() {
        // this.varName.gotoRow()
    }


}
