import { Component, OnInit } from '@angular/core';
import { Utils } from '../shared/classes/utils';
import { TransferTypeService } from '../services/transferType.service';
import { ITransferType } from '../models/transferType';

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
        this.service.getTransferTypes().subscribe(data => this.filteredTransferTypes = this.transferTypes = data, error => Utils.ErrorLogger(error));
    }

    filter(query: string) {
        this.filteredTransferTypes = query ? this.transferTypes.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.transferTypes;
    }

}
