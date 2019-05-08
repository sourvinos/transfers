import { ITaxOffice } from './../models/taxOffice';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DeleteDialogComponent } from '../shared/components/delete-dialog/delete-dialog.component';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';

import { TaxOfficeService } from '../services/taxOffice.service';
import { Utils } from '../shared/classes/utils';

@Component({
    selector: 'app-taxOffice-form',
    templateUrl: './taxOffice-form.component.html',
    styleUrls: ['./taxOffice-form.component.css', '../shared/styles/input-forms.css']
})

export class TaxOfficeFormComponent implements OnInit {

    id: number = null;
    subHeader: string = 'New';

    taxOffice: ITaxOffice = {
        id: null,
        description: '',
        user: ''
    }

    form = this.formBuilder.group({
        id: '0',
        description: ['', [Validators.required, Validators.maxLength(100)]],
        user: ['']
    })

    constructor(private service: TaxOfficeService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private dialog: MatDialog, private snackBar: MatSnackBar) {
        route.params.subscribe(p => (this.id = p['id']))
    };

    ngOnInit() {
        if (this.id) {
            this.subHeader = 'Edit'
            this.service.getTaxOffice(this.id).subscribe(result => {
                this.populateFields()
            }, error => {
                if (error.status == 404) {
                    this.router.navigate(['/error'])
                }
            });
        }
    }

    populateFields() {
        this.service.getTaxOffice(this.id).subscribe(
            result => {
                this.form.setValue({
                    id: result.id,
                    description: result.description,
                    user: result.user
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
            this.service.addTaxOffice(this.form.value).subscribe(data => {
                this.router.navigate(['/taxOffices'])
                this.snackBar.open('Tax office saved!', '', { duration: 1500 })
            }, error => Utils.ErrorLogger(error));
        }
        else {
            if (this.id != null)
                this.service.updateTaxOffice(this.id, this.form.value).subscribe(data => {
                    this.router.navigate(['/taxOffices'])
                    this.snackBar.open('Tax office updated!', '', { duration: 1500 })
                }, error => Utils.ErrorLogger(error));
        }
    }

    delete() {
        if (this.id != null) {
            this.dialog.open(DeleteDialogComponent).afterClosed().subscribe(response => {
                if (response == 'yes') {
                    this.service.deleteTaxOffice(this.id).subscribe(data => {
                        this.router.navigate(['/taxOffices'])
                        this.snackBar.open('Tax office deleted!', '', { duration: 1500 })
                    }, error => Utils.ErrorLogger(error));
                }
            });
        }
    }

    goBack() {
        this.router.navigate(['/taxOffices']);
    }

}
