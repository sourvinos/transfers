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
    styleUrls: ['./customer-form.component.css']
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
        description: ['', [Validators.required, Validators.maxLength(100)]],
        profession: ['', [Validators.maxLength(100)]],
        taxOfficeId: ['', Validators.required],
        vatStateId: ['', Validators.required],
        address: ['', [Validators.maxLength(100)]],
        phones: ['', [Validators.maxLength(100)]],
        personInCharge: ['', [Validators.maxLength(100)]],
        email: ['', [Validators.maxLength(100)]],
        taxNo: ['', [Validators.maxLength(100)]],
        accountCode: ['', [Validators.maxLength(100)]],
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

    get profession() {
        return this.form.get('profession');
    }

    get address() {
        return this.form.get('address');
    }

    get phones() {
        return this.form.get('phones');
    }
    get personInCharge() {
        return this.form.get('personInCharge');
    }

    get email() {
        return this.form.get('email');
    }

    get taxNo() {
        return this.form.get('taxNo');
    }
    get accountCode() {
        return this.form.get('accountCode');
    }

    get taxOfficeId() {
        return this.form.get('taxOfficeId');
    }

    get vatStateId() {
        return this.form.get('vatStateId');
    }

    getRequiredFieldMessage() {
        return 'This field is required, silly!';
    }

    getMaxLengthFieldMessage() {
        return 'This field must not be longer than '
    }

    getValidationPassMessage() {
        return 'This field is valid'
    }



    save() {
        if (!this.form.valid) return
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
