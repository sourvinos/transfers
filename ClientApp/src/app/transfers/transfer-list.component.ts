import { Component, OnInit } from '@angular/core';
import { get } from 'scriptjs';

import { ITransfer } from './../models/transfer';
import { TransferService } from '../services/transfer.service';
import { Utils } from '../shared/classes/utils';

@Component({
    selector: 'app-transfer-list',
    templateUrl: './transfer-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class TransferListComponent implements OnInit {

    transfers: ITransfer[];

    customerId: number = 35;

    constructor(private service: TransferService) { }

    ngOnInit() {
        get('script.js', () => { });
        this.service.getTransfers(this.customerId).subscribe(data => {
            this.transfers = data
        }, error => Utils.ErrorLogger(error));
    }

}
