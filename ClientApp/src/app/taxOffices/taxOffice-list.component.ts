// Base
import { Component, OnInit } from '@angular/core';
import { get } from 'scriptjs';
// Custom
import { TaxOfficeService } from '../services/taxOffice.service';
import { Utils } from '../shared/classes/utils';
import { ITaxOffice } from './../models/taxOffice';

@Component({
    selector: 'taxOffice-list',
    templateUrl: './taxOffice-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class TaxOfficeListComponent implements OnInit {

    taxOffices: ITaxOffice[];
    filteredTaxOffices: ITaxOffice[];

    constructor(private service: TaxOfficeService) { }

    ngOnInit() {
        get('script.js', () => { });
        this.service.getTaxOffices().subscribe(data => this.filteredTaxOffices = this.taxOffices = data, error => Utils.ErrorLogger(error));
    }

    filter(query: string) {
        this.filteredTaxOffices = query ? this.taxOffices.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.taxOffices;
    }

}
