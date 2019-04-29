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

    constructor(private service: RouteService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private dialog: MatDialog) { };

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
        shortDescription: ['', Validators.required],
        description: ['', Validators.required],
        user: ['']
    })

    populateFields() {
        this.service.getRoute(this.id).subscribe(
            result => {
                this.coachRoute = result;
                this.form.get('id').setValue(this.coachRoute.id);
                this.form.get('shortDescription').setValue(this.coachRoute.shortDescription);
                this.form.get('description').setValue(this.coachRoute.description);
                this.form.get('user').setValue(this.coachRoute.user);
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
        console.log(this.id)
        if (this.id == null) {
            this.service.addRoute(this.form.value).subscribe(data => this.router.navigate(['/routes']), error => Utils.ErrorLogger(error));
        } else {
            this.service.updateRoute(this.form.value.id, this.form.value).subscribe(data => this.router.navigate(['/routes']), error => Utils.ErrorLogger(error));
        }
    }

    delete() {
        if (this.id != null) {
            this.dialog.open(DeleteDialogComponent).afterClosed().subscribe(response => {
                if (response == 'yes') {
                    this.service.deleteRoute(this.id).subscribe(data => {
                        this.router.navigate(['/routes'])
                    }, error => Utils.ErrorLogger(error));
                }
            });
        }
    }

    goBack() {
        this.router.navigate(['/routes']);
    }

}
