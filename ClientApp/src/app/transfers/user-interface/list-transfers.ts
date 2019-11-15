import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ITransferFlat } from '../../models/transfer-flat';
import { KeyboardShortcuts, Unlisten } from '../../services/keyboard-shortcuts.service';
import { ComponentInteractionService } from '../../shared/services/component-interaction.service';
import { TransferService } from '../classes/service-transfer';

@Component({
    selector: 'app-transfer-list',
    templateUrl: './list-transfers.html',
    styleUrls: ['./list-transfers.css']
})

export class TransferListComponent {

    date: string
    currentDate: string

    queryResult: any = {}
    queryResultFiltered: any = {}

    unlisten: Unlisten

    dataSource: MatTableDataSource<ITransferFlat>
    selection: SelectionModel<[]>

    transfersFlat: ITransferFlat[] = []

    columns = ['id', 'destination', 'route', 'customer', 'pickupPoint', 'time', 'adults', 'kids', 'free', 'totalPersons', 'driver', 'port']
    fields = ['Id', 'Destination', 'Route', 'Customer', 'Pickup point', 'Time', 'Adults', 'Kids', 'Free', 'Total', 'Driver', 'Port']
    format = ['', '', '', '', '', '', '', '', '', '', '', '']
    width = ['0', '500', '300', '300', '300', '100', '100', '100', '100', '100', '200', '200']
    align = ['center', 'left', 'left', 'left', 'left', 'center', 'right', 'right', 'right', 'right', 'left', 'left']

    constructor(private transfersService: TransferService, private componentInteractionService: ComponentInteractionService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private keyboardShortcutsService: KeyboardShortcuts) {
        this.route.params.subscribe((params: Params) => {
            this.date = params['date']
            this.getFilteredTransfers()
        })
    }

    editRecord(transferId: number) {
        this.router.navigate(['transfer/', transferId], {
            relativeTo: this.route
        })
    }

    private async getFilteredTransfers() {
        this.transfersService.getTransfers(localStorage.getItem('date')).subscribe((result: any) => {
            this.queryResult = this.queryResultFiltered = result
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
            } of this.queryResult.transfers) {
                this.transfersFlat.push({ id: a, destination: b, customer: c, adults: d, kids: e, free: f, totalPersons: g, pickupPoint: h, time: i, route: j, port: k, driver: l, userName: m, dateIn: n, remarks: o })
            }
            this.dataSource = new MatTableDataSource<ITransferFlat>(this.transfersFlat)
            this.selection = new SelectionModel<[]>(false)
        })
    }
}
