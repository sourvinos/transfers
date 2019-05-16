import { Component, OnInit } from '@angular/core';
import { get } from 'scriptjs';

import { IVatState } from '../models/vatState';
import { VatStateService } from '../services/vatState.service';
import { Utils } from '../shared/classes/utils';

@Component({
    selector: 'vatState-list',
    templateUrl: './vatState-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class VatStateListComponent implements OnInit {

    vatStates: IVatState[];
    filteredVatStates: IVatState[];

    constructor(private service: VatStateService) { }

    ngOnInit() {
        get('script.js', () => { });
        this.service.getVatStates().subscribe(data => this.filteredVatStates = this.vatStates = data, error => Utils.ErrorLogger(error));
    }

    filter(query: string) {
        this.filteredVatStates = query ? this.vatStates.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.vatStates;
    }

}
