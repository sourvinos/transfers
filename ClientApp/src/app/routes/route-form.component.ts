import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';

import { IRoute } from '../models/route';
import { Utils } from '../shared/classes/utils';
import { DeleteDialogComponent } from '../shared/components/delete-dialog/delete-dialog.component';
import { RouteService } from '../services/route.service';

@Component({
    selector: 'app-route-form',
    templateUrl: './route-form.component.html',
    styleUrls: ['./route-form.component.css', '../shared/styles/input-forms.css']
})

export class RouteFormComponent implements OnInit {

    id: string;
    coachRoute: IRoute = {
        id: 0,
        shortDescription: '',
        description: '',
        user: '',
        pickupPoints: []
    }
    isNewRecord: boolean = true;
    subHeader: string = '';

    constructor(private service: RouteService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private dialog: MatDialog, private snackBar: MatSnackBar) { };

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
        id: '0',
        shortDescription: ['', [Validators.required, Validators.maxLength(5)]],
        description: ['', [Validators.required, Validators.maxLength(50)]],
        user: ['']
    })

    populateFields() {
        this.service.getRoute(this.id).subscribe(
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
            this.service.addRoute(this.form.value).subscribe(data => {
                this.router.navigate(['/routes'])
                this.snackBar.open('Route saved!', '', { duration: 1500 })
            }, error => Utils.ErrorLogger(error));
        }
        else {
            if (this.id != null) this.service.updateRoute(this.form.value.id, this.form.value).subscribe(data => {
                this.router.navigate(['/routes'])
                this.snackBar.open('Route updated!', '', { duration: 1500 })
            }, error => Utils.ErrorLogger(error));
        }
    }

    delete() {
        if (this.id != null) {
            this.dialog.open(DeleteDialogComponent).afterClosed().subscribe(response => {
                if (response == 'yes') {
                    this.service.deleteRoute(this.id).subscribe(data => {
                        this.router.navigate(['/routes'])
                        this.snackBar.open('Route deleted!', '', { duration: 1500 })
                    }, error => Utils.ErrorLogger(error));
                }
            });
        }
    }

    goBack() {
        this.router.navigate(['/routes']);
    }

}
