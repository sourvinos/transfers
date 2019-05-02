import { ActivatedRoute, Router } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { DeleteDialogComponent } from '../shared/components/delete-dialog/delete-dialog.component'
import { FormBuilder, Validators } from '@angular/forms'
import { MatDialog, MatSnackBar } from '@angular/material'
import { forkJoin } from 'rxjs'

import { IPickupPoint } from './../models/pickupPoint';
import { PickupPointService } from '../services/pickupPoint.service'
import { Utils } from '../shared/classes/utils';

@Component({
    selector: 'pickupPoint-customer-form',
    templateUrl: './pickupPoint-form.component.html',
    styleUrls: ['./pickupPoint-form.component.css', '../shared/styles/input-forms.css']
})

export class PickupPointFormComponent implements OnInit {

    routes: any

    id: number = null;
    subHeader: string = 'New';

    pickupPoint: IPickupPoint = {
        id: null,
        routeId: null,
        description: '',
        exactPoint: '',
        time: '',
        user: '',
    }

    form = this.formBuilder.group({
        id: 0,
        routeId: 0,
        description: ['', [Validators.required, Validators.maxLength(50)]],
        exactPoint: ['', [Validators.required]],
        time: ['', [Validators.required, Validators.maxLength(5)]],
        user: ['']
    })

    constructor(private service: PickupPointService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private dialog: MatDialog, private snackBar: MatSnackBar) {
        route.params.subscribe(p => this.id = p['id'])
    }

    ngOnInit() {
        let sources = [this.service.getRoutes()]
        if (this.id) {
            this.subHeader = 'Edit'
            sources.push(this.service.getPickupPoint(this.id))
        }
        return forkJoin(sources).subscribe(
            result => {
                this.routes = result[0]
                if (this.id) {
                    this.populateFields()
                    this.populateRoutes()
                }
            },
            error => {
                if (error.status == 404) {
                    this.router.navigate(['/error'])
                }
            }
        )
    }

    private populateRoutes() {
        const selectedRoute = this.routes.find((x: { id: any }) => x.id == this.pickupPoint.routeId)
    }

    populateFields() {
        this.service.getPickupPoint(this.id).subscribe(
            result => {
                this.form.setValue({
                    id: result.id,
                    routeId: result.routeId,
                    description: result.description,
                    exactPoint: result.exactPoint,
                    time: result.time,
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

    get time() {
        return this.form.get('time');
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
            this.service.addPickupPoint(this.form.value).subscribe(data => {
                this.router.navigate(['/pickuppoints'])
            }, (error: Response) => Utils.ErrorLogger(error));
        }
        else
            this.service.updatePickupPoint(this.id, this.form.value).subscribe(data => {
                this.router.navigate(['/pickuppoints'])
            }, (error: Response) => Utils.ErrorLogger(error));
    }

    delete() {
        if (this.pickupPoint.id != null) {
            this.dialog.open(DeleteDialogComponent).afterClosed().subscribe(response => {
                if (response == 'yes') {
                    this.service.deletePickupPoint(this.pickupPoint.id).subscribe(data => {
                        this.router.navigate(['/pickuppoints'])
                        this.snackBar.open('Pickup point deleted!', '', { duration: 1500 })
                    }, error => Utils.ErrorLogger(error));
                }
            });
        }
    }

    goBack() {
        this.router.navigate(['/pickuppoints']);
    }

}
