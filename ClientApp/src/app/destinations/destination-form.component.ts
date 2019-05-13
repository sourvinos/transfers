import { IDestination } from './../models/destination';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { DestinationService } from '../services/destination.service';
import { Utils } from '../shared/classes/utils';

@Component({
    selector: 'app-destination-form',
    templateUrl: './destination-form.component.html',
    styleUrls: ['./destination-form.component.css', '../shared/styles/input-forms.css']
})

export class DestinationFormComponent implements OnInit {

    id: number = null;
    subHeader: string = 'New';

    destination: IDestination = {
        id: null,
        shortDescription: '',
        description: '',
        user: ''
    }

    form = this.formBuilder.group({
        id: '0',
        shortDescription: [''],
        description: ['', [Validators.required, Validators.maxLength(100)]],
        user: ['']
    })

    constructor(private service: DestinationService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {
        route.params.subscribe(p => (this.id = p['id']))
    };

    ngOnInit() {
        if (this.id) {
            this.subHeader = 'Edit'
            this.service.getDestination(this.id).subscribe(result => {
                this.populateFields()
            }, error => {
                if (error.status == 404) {
                    this.router.navigate(['/error'])
                }
            });
        }
    }

    populateFields() {
        this.service.getDestination(this.id).subscribe(
            result => {
                this.form.setValue({
                    id: result.id,
                    shortDescription: result.shortDescription,
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
            this.service.addDestination(this.form.value).subscribe(data => {
                this.router.navigate(['/destinations'])
            }, error => Utils.ErrorLogger(error));
        }
        else {
            if (this.id != null)
                this.service.updateDestination(this.id, this.form.value).subscribe(data => {
                    this.router.navigate(['/destinations'])
                }, error => Utils.ErrorLogger(error));
        }
    }

    delete() {
        if (this.id != null) {
            if (confirm('Please confirm')) {
                this.service.deleteDestination(this.id).subscribe(data => {
                    this.router.navigate(['/destinations'])
                }, error => Utils.ErrorLogger(error));
            }
        }
    }

    goBack() {
        this.router.navigate(['/destinations']);
    }

}
