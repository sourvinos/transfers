import { ActivatedRoute, Router } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { forkJoin } from 'rxjs'

import { IPickupPoint } from './../models/pickupPoint';
import { PickupPointService } from '../services/pickupPoint.service'
import { Utils } from '../shared/classes/utils';

@Component({
    selector: 'pickupPoint-customer-form',
    templateUrl: './pickupPoint-form.component.html',
    styleUrls: ['./pickupPoint-form.component.css']
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
        description: ['', [Validators.required, Validators.maxLength(100)]],
        exactPoint: ['', [Validators.maxLength(100)]],
        time: ['', [Validators.required, Validators.pattern("[0-9][0-9]:[0-9][0-9]")]],
        user: ['']
    })

    constructor(private service: PickupPointService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {
        route.params.subscribe(p => this.id = p['id'])
    }

    ngOnInit() {
        let sources = [this.service.getRoutes()]
        if (this.id) {
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

    get routeId() {
        return this.form.get('routeId');
    }

    get description() {
        return this.form.get('description');
    }

    get exactPoint() {
        return this.form.get('exactPoint');
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
        if (this.id != null) {
            if (confirm('This record will permanently be deleted. Are you sure?')) {
                this.service.deletePickupPoint(this.id).subscribe(data => {
                    this.router.navigate(['/pickuppoints'])
                }, error => Utils.ErrorLogger(error));
            }
        }
    }

    goBack() {
        this.router.navigate(['/pickuppoints']);
    }

}
