import { Component, OnInit } from '@angular/core';

import { CountryService } from '../services/country.service';
import { ICountry } from '../models/country';
import { Utils } from '../shared/classes/utils';

@Component({
	selector: 'app-country-list',
	templateUrl: './country-list.component.html',
	styleUrls: ['../shared/styles/lists.css']
})

export class CountryListComponent implements OnInit {

	countries: ICountry[];
	filteredCountries: ICountry[];

	constructor(private service: CountryService) { }

	ngOnInit() {
		this.service.getCountries().subscribe(data => this.filteredCountries = this.countries = data, error => Utils.ErrorLogger(error));
	}

	filter(query: string) {
		this.filteredCountries = query ? this.countries.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.countries;
	}

}
