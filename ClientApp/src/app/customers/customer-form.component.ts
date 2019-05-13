import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { get } from 'scriptjs';

import { CustomerService } from '../services/customer.service';
import { ICustomer } from '../models/customer';
import { TaxOfficeService } from '../services/taxOffice.service';
import { Utils } from '../shared/classes/utils';
import { VatStateService } from '../services/vatState.service';

@Component({
    selector: 'app-customer-form',
    templateUrl: './customer-form.component.html',
    styleUrls: ['./customer-form.component.css', '../shared/styles/input-forms.css']
})

export class CustomerFormComponent implements OnInit {

    taxOffices: any
    vatStates: any

    id: number = null;
    subHeader: string = 'New';

    customer: ICustomer = {
        id: null,
        description: '',
        profession: '',
        taxOfficeId: null,
        vatStateId: null,
        address: '',
        phones: '',
        personInCharge: '',
        email: '',
        taxNo: '',
        accountCode: '',
        user: ''
    }

    form = this.formBuilder.group({
        id: 0,
        description: ['', Validators.required],
        profession: [''],
        taxOfficeId: ['', Validators.required],
        vatStateId: ['', Validators.required],
        address: [''],
        phones: [''],
        personInCharge: [''],
        email: [''],
        taxNo: [''],
        accountCode: [''],
        user: ['']
    })

    constructor(private customerService: CustomerService, private taxOfficeService: TaxOfficeService, private vatStateService: VatStateService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {
        route.params.subscribe(p => (this.id = p['id']))
    };

    ngOnInit() {
        let sources = []
        get('script.js', () => { })
        sources.push(this.taxOfficeService.getTaxOffices())
        sources.push(this.vatStateService.getVatStates())
        if (this.id) {
            sources.push(this.customerService.getCustomer(this.id))
        }
        return forkJoin(sources).subscribe(
            result => {
                this.taxOffices = result[0]
                this.vatStates = result[1]
                if (this.id) {
                    this.populateFields()
                }
            },
            error => {
                if (error.status == 404) {
                    this.router.navigate(['/error'])
                }
            }
        )
    }

    populateFields() {
        this.customerService.getCustomer(this.id).subscribe(
            result => {
                this.form.setValue({
                    id: result.id,
                    description: result.description,
                    profession: result.profession,
                    taxOfficeId: result.taxOfficeId,
                    vatStateId: result.vatStateId,
                    address: result.address,
                    phones: result.phones,
                    personInCharge: result.personInCharge,
                    email: result.email,
                    taxNo: result.taxNo,
                    accountCode: result.accountCode,
                    user: result.user
                })
            },
            error => {
                Utils.ErrorLogger(error);
            });
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
        if (this.id == null) {
            this.customerService.addCustomer(this.form.value).subscribe(data => this.router.navigate(['/customers']), error => Utils.ErrorLogger(error));
        } else {
            this.customerService.updateCustomer(this.form.value.id, this.form.value).subscribe(data => this.router.navigate(['/customers']), error => Utils.ErrorLogger(error));
        }
    }

    delete() {
        if (this.id != null) {
            if (confirm('Please confirm')) {
                this.customerService.deleteCustomer(this.id).subscribe(data => {
                    this.router.navigate(['/customers'])
                }, error => Utils.ErrorLogger(error));
            };
        }
    }

    goBack() {
        this.router.navigate(['/customers']);
    }

}
