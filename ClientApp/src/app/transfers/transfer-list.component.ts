import { Component, OnInit } from '@angular/core';

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

    constructor(private service: TransferService) { }

    ngOnInit() {
        this.service.getTransfers().subscribe(data => { this.transfers = data }, error => Utils.ErrorLogger(error));
    }

}
