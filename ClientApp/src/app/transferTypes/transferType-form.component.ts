import { ITransferType } from './../models/transferType';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DeleteDialogComponent } from '../shared/components/delete-dialog/delete-dialog.component';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';

import { Utils } from '../shared/classes/utils';
import { TransferTypeService } from '../services/transferType.service';

@Component({
    selector: 'app-transferType-form',
    templateUrl: './transferType-form.component.html',
    styleUrls: ['./transferType-form.component.css', '../shared/styles/input-forms.css']
})

export class TransferTypeFormComponent implements OnInit {

    id: number = null;
    subHeader: string = 'New';

    transferType: ITransferType = {
        id: null,
        description: '',
        user: ''
    }

    form = this.formBuilder.group({
        id: '0',
        description: ['', [Validators.required, Validators.maxLength(100)]],
        user: ['']
    })

    constructor(private service: TransferTypeService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private dialog: MatDialog, private snackBar: MatSnackBar) {
        route.params.subscribe(p => (this.id = p['id']))
    };

    ngOnInit() {
        if (this.id) {
            this.subHeader = 'Edit'
            this.service.getTransferType(this.id).subscribe(result => {
                this.populateFields()
            }, error => {
                if (error.status == 404) {
                    this.router.navigate(['/error'])
                }
            });
        }
    }

    populateFields() {
        this.service.getTransferType(this.id).subscribe(
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
            this.service.addTransferType(this.form.value).subscribe(data => {
                this.router.navigate(['/transferTypes'])
                this.snackBar.open('Transfer type saved!', '', { duration: 1500 })
            }, error => Utils.ErrorLogger(error));
        }
        else {
            if (this.id != null)
                this.service.updateTransferType(this.id, this.form.value).subscribe(data => {
                    this.router.navigate(['/transferTypes'])
                    this.snackBar.open('Transfer type updated!', '', { duration: 1500 })
                }, error => Utils.ErrorLogger(error));
        }
    }

    delete() {
        if (this.id != null) {
            this.dialog.open(DeleteDialogComponent).afterClosed().subscribe(response => {
                if (response == 'yes') {
                    this.service.deleteTransferType(this.id).subscribe(data => {
                        this.router.navigate(['/transferTypes'])
                        this.snackBar.open('Transfer type deleted!', '', { duration: 1500 })
                    }, error => Utils.ErrorLogger(error));
                }
            });
        }
    }

    goBack() {
        this.router.navigate(['/vatStates']);
    }

}
