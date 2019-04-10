import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';

import { CountryService } from '../services/country.service';
import { DescriptionValidators } from './country-validators';
import { ICountry } from '../models/country';
import { Utils } from '../shared/classes/utils';
import { DeleteDialogComponent } from '../shared/components/delete-dialog/delete-dialog.component';

@Component({
	selector: 'app-country-form',
	templateUrl: './country-form.component.html',
	styleUrls: ['./country-form.component.css', '../shared/styles/input-forms.css']
})

export class CountryFormComponent implements OnInit {

	id: string;
	country: ICountry;
	homeURL: string = '/countries';
	isNewRecord: boolean = true;
	subHeader: string = '';

	constructor(private service: CountryService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private dialog: MatDialog) { };

	ngOnInit() {
		this.subHeader = 'New';
		this.id = this.route.snapshot.paramMap.get('id');
		if (this.id) {
			this.isNewRecord = false;
			this.subHeader = 'Edit';
			this.populateFields();
		}
	}

	form = this.formBuilder.group({
		countryId: 0,
		description: ['', DescriptionValidators.cannotExceedMaxLength]
	})

	populateFields() {
		this.service.getCountry(this.id).subscribe(
			result => {
				this.country = result;
				this.form.get('countryId').setValue(this.country.countryId);
				this.form.get('description').setValue(this.country.description);
			},
			error => {
				Utils.ErrorLogger(error);
			});;
	}

	get description() {
		return this.form.get('description');
	}

	getErrorMessage() {
		return 'This field is required!';
	}

	save() {
		if (this.id == null) {
			this.service.addCountry(this.form.value).subscribe(data => this.router.navigate(['/countries']), error => Utils.ErrorLogger(error));
		} else {
			this.service.updateCountry(this.form.value.countryId, this.form.value).subscribe(data => this.router.navigate(['/countries']), error => Utils.ErrorLogger(error));
		}
	}

	delete() {
		if (this.id != null) {
			this.dialog.open(DeleteDialogComponent).afterClosed().subscribe(response => {
				if (response == 'yes') {
					this.service.deleteCountry(this.id).subscribe(data => {
						this.router.navigate(['/countries'])
					}, error => Utils.ErrorLogger(error));
				}
			});
		}
	}

	goBack() {
		this.router.navigate(['/countries']);
	}

}
