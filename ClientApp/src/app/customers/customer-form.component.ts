import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';

import { CustomerService } from '../services/customer.service';
import { DescriptionValidators } from './customer-validators';
import { ICustomer } from '../models/customer';
import { Utils } from '../shared/classes/utils';
import { DeleteDialogComponent } from '../shared/components/delete-dialog/delete-dialog.component';

@Component({
    selector: 'app-customer-form',
    templateUrl: './customer-form.component.html',
    styleUrls: ['./customer-form.component.css', '../shared/styles/input-forms.css']
})

export class CustomerFormComponent implements OnInit {

    id: string;
    customer: ICustomer;
    homeURL: string = '/customers';
    isNewRecord: boolean = true;
    subHeader: string = '';

    constructor(private service: CustomerService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private dialog: MatDialog) { };

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
        id: 0,
        description: ['', Validators.required, Validators.maxLength(50)],
        profession: [''],
        taxOfficeId: [''],
        vatStateId: [''],
        address: [''],
        phones: [''],
        personInCharge: [''],
        email: [''],
        taxNo: [''],
        accountCode: [''],
        user: ['']
    })

    populateFields() {
        this.service.getCustomer(this.id).subscribe(
            result => {
                this.customer = result;
                this.form.get('id').setValue(this.customer.id);
                this.form.get('description').setValue(this.customer.description);
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
            this.service.addCustomer(this.form.value).subscribe(data => this.router.navigate(['/customers']), error => Utils.ErrorLogger(error));
        } else {
            this.service.updateCustomer(this.form.value.customerId, this.form.value).subscribe(data => this.router.navigate(['/customers']), error => Utils.ErrorLogger(error));
        }
    }

    delete() {
        if (this.id != null) {
            this.dialog.open(DeleteDialogComponent).afterClosed().subscribe(response => {
                if (response == 'yes') {
                    this.service.deleteCustomer(this.id).subscribe(data => {
                        this.router.navigate(['/customers'])
                    }, error => Utils.ErrorLogger(error));
                }
            });
        }
    }

    goBack() {
        this.router.navigate(['/customers']);
    }

}
