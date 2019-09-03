// Base
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// Custom
import { TaxOfficeService } from '../services/taxOffice.service';
import { Utils } from '../shared/classes/utils';

@Component({
    selector: 'app-taxOffice-form',
    templateUrl: './taxOffice-form.component.html',
    styleUrls: ['../shared/styles/forms.css']
})

export class TaxOfficeFormComponent implements OnInit {

    id: number = null;

    form = this.formBuilder.group({
        id: 0,
        description: ['', [Validators.required, Validators.maxLength(100)]],
        userName: ['']
    })

    constructor(private taxOfficeService: TaxOfficeService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {
        route.params.subscribe(p => (this.id = p['id']))
    };

    ngOnInit() {
        if (this.id) {
            this.taxOfficeService.getTaxOffice(this.id).subscribe(result => {
                this.populateFields()
            }, error => {
                if (error.status == 404) {
                    this.router.navigate(['/error'])
                }
            });
        }
    }

    populateFields() {
        this.taxOfficeService.getTaxOffice(this.id).subscribe(
            result => {
                this.form.setValue({
                    id: result.id,
                    description: result.description,
                    userName: result.userName
                })
            },
            error => {
                Utils.ErrorLogger(error);
            });;
    }

    get description() {
        return this.form.get('description');
    }

    getRequiredFieldMessage() {
        return 'This field is required, silly!';
    }

    getMaxLengthFieldMessage() {
        return 'This field must not be longer than '
    }

    save() {
        if (!this.form.valid) return
        if (this.id == null) {
            this.taxOfficeService.addTaxOffice(this.form.value).subscribe(data => this.router.navigate(['/taxOffices']), error => Utils.ErrorLogger(error));
        }
        else {
            this.taxOfficeService.updateTaxOffice(this.id, this.form.value).subscribe(data => this.router.navigate(['/taxOffices']), error => Utils.ErrorLogger(error));
        }
    }

    delete() {
        if (this.id != null) {
            if (confirm('This record will permanently be deleted. Are you sure?')) {
                this.taxOfficeService.deleteTaxOffice(this.id).subscribe(data => this.router.navigate(['/taxOffices']), error => Utils.ErrorLogger(error));
            }
        }
    }

    goBack() {
        this.router.navigate(['/taxOffices']);
    }

}
