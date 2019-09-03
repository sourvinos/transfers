// Base
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// Custom
import { DestinationService } from '../services/destination.service';
import { Utils } from '../shared/classes/utils';

@Component({
    selector: 'app-destination-form',
    templateUrl: './destination-form.component.html',
    styleUrls: ['../shared/styles/forms.css']
})

export class DestinationFormComponent implements OnInit {

    id: number = null;

    form = this.formBuilder.group({
        id: 0,
        shortDescription: ['', [Validators.maxLength(5)]],
        description: ['', [Validators.required, Validators.maxLength(100)]],
        userName: ['']
    })

    constructor(private destinationService: DestinationService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {
        route.params.subscribe(p => (this.id = p['id']))
    };

    ngOnInit() {
        if (this.id) {
            this.destinationService.getDestination(this.id).subscribe(result => {
                this.populateFields()
            }, error => {
                if (error.status == 404) {
                    this.router.navigate(['/error'])
                }
            });
        }
    }

    populateFields() {
        this.destinationService.getDestination(this.id).subscribe(
            result => {
                this.form.setValue({
                    id: result.id,
                    shortDescription: result.shortDescription,
                    description: result.description,
                    userName: result.userName
                })
            },
            error => {
                Utils.ErrorLogger(error);
            });;
    }

    get shortDescription() {
        return this.form.get('shortDescription');
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
            this.destinationService.addDestination(this.form.value).subscribe(data => this.router.navigate(['/destinations']), error => Utils.ErrorLogger(error));
        }
        else {
            this.destinationService.updateDestination(this.id, this.form.value).subscribe(data => this.router.navigate(['/destinations']), error => Utils.ErrorLogger(error));
        }
    }

    delete() {
        if (this.id != null) {
            if (confirm('This record will permanently be deleted. Are you sure?')) {
                this.destinationService.deleteDestination(this.id).subscribe(data => this.router.navigate(['/destinations']), error => Utils.ErrorLogger(error));
            }
        }
    }

    goBack() {
        this.router.navigate(['/destinations']);
    }

}
