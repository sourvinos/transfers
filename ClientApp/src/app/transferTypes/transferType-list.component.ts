import { Component, OnInit } from '@angular/core';
import { get } from 'scriptjs';

import { ITransferType } from '../models/transferType';
import { TransferTypeService } from '../services/transferType.service';
import { Utils } from '../shared/classes/utils';

@Component({
    selector: 'transferType-list',
    templateUrl: './transferType-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class TransferTypeListComponent implements OnInit {

    transferTypes: ITransferType[];
    filteredTransferTypes: ITransferType[];

    constructor(private service: TransferTypeService) { }

    ngOnInit() {
        get('script.js', () => { });
        this.service.getTransferTypes().subscribe(data => this.filteredTransferTypes = this.transferTypes = data, error => Utils.ErrorLogger(error));
    }

    filter(query: string) {
        this.filteredTransferTypes = query ? this.transferTypes.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.transferTypes;
    }

}
