import { IVatState } from './../models/vatState';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Utils } from '../shared/classes/utils';
import { VatStateService } from '../services/vatState.service';

@Component({
    selector: 'app-vatState-form',
    templateUrl: './vatState-form.component.html',
    styleUrls: ['./vatState-form.component.css', '../shared/styles/input-forms.css']
})

export class VatStateFormComponent implements OnInit {

    id: number = null;
    subHeader: string = 'New';

    vatState: IVatState = {
        id: null,
        description: '',
        user: ''
    }

    form = this.formBuilder.group({
        id: '0',
        description: ['', [Validators.required, Validators.maxLength(100)]],
        user: ['']
    })

    constructor(private service: VatStateService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {
        route.params.subscribe(p => (this.id = p['id']))
    };

    ngOnInit() {
        if (this.id) {
            this.subHeader = 'Edit'
            this.service.getVatState(this.id).subscribe(result => {
                this.populateFields()
            }, error => {
                if (error.status == 404) {
                    this.router.navigate(['/error'])
                }
            });
        }
    }

    populateFields() {
        this.service.getVatState(this.id).subscribe(
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
            this.service.getVatState(this.form.value).subscribe(data => {
                this.router.navigate(['/vatStates'])
            }, error => Utils.ErrorLogger(error));
        }
        else {
            if (this.id != null)
                this.service.updateVatState(this.id, this.form.value).subscribe(data => {
                    this.router.navigate(['/vatStates'])
                }, error => Utils.ErrorLogger(error));
        }
    }

    delete() {
        if (this.id != null) {
            if (confirm('Please confirm')) {
                this.service.deleteVatState(this.id).subscribe(data => {
                    this.router.navigate(['/vatStates'])
                }, error => Utils.ErrorLogger(error));
            }
        }
    }

    goBack() {
        this.router.navigate(['/vatStates']);
    }

}
