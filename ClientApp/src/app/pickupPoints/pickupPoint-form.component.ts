import { ActivatedRoute, Router } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, Validators, FormControl } from '@angular/forms'
import { forkJoin } from 'rxjs'

import { PickupPointService } from '../services/pickupPoint.service'
import { Utils } from '../shared/classes/utils'
import { RouteService } from '../services/route.service'

@Component({
    selector: 'pickupPoint-customer-form',
    templateUrl: './pickupPoint-form.component.html',
    styleUrls: ['../shared/styles/forms.css']
})

export class PickupPointFormComponent implements OnInit {

    routes: any

    id: number = null

    form = this.formBuilder.group({
        id: 0,
        routeId: ['', Validators.required],
        routeDescription: ['', [Validators.required]],
        description: ['', [Validators.required, Validators.maxLength(100)]],
        exactPoint: ['', [Validators.maxLength(100)]],
        time: ['', [Validators.required, Validators.pattern("[0-9][0-9]:[0-9][0-9]")]],
        user: ['']
    })

    constructor(private routeService: RouteService, private pickupPointservice: PickupPointService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {
        route.params.subscribe(p => this.id = p['id'])
    }

    ngOnInit() {
        let sources = []
        sources.push(this.routeService.getRoutes())
        if (this.id) {
            sources.push(this.pickupPointservice.getPickupPoint(this.id))
        }
        return forkJoin(sources).subscribe(
            result => {
                this.routes = result[0]
                if (this.id) {
                    this.populateFields()
                }
            },
            error => {
                if (error.status == 404) {
                    this.router.navigate(['/error'])
                }
            }
        )
    }

    populateFields() {
        this.pickupPointservice.getPickupPoint(this.id).subscribe(
            result => {
                this.form.setValue({
                    id: result.id,
                    routeId: result.route.id,
                    routeDescription: result.route.description,
                    description: result.description,
                    exactPoint: result.exactPoint,
                    time: result.time,
                    user: result.user
                })
            },
            error => {
                Utils.ErrorLogger(error)
            })
    }

    get routeId() {
        return this.form.get('routeId')
    }

    get routeDescription() {
        return this.form.get('routeDescription')
    }

    get description() {
        return this.form.get('description')
    }

    get exactPoint() {
        return this.form.get('exactPoint')
    }

    get time() {
        return this.form.get('time')
    }

    getRequiredFieldMessage() {
        return 'This field is required, silly!'
    }

    getMaxLengthFieldMessage() {
        return 'This field must not be longer than '
    }

    save() {
        if (!this.form.valid) return
        if (this.id == null) {
            this.pickupPointservice.addPickupPoint(this.form.value).subscribe(data => { this.router.navigate(['/pickuppoints']) }, (error: Response) => Utils.ErrorLogger(error))
        }
        else {
            this.pickupPointservice.updatePickupPoint(this.id, this.form.value).subscribe(data => { this.router.navigate(['/pickuppoints']) }, (error: Response) => Utils.ErrorLogger(error))
        }
    }

    delete() {
        if (this.id != null) {
            if (confirm('This record will permanently be deleted. Are you sure?')) {
                this.pickupPointservice.deletePickupPoint(this.id).subscribe(data => {
                    this.router.navigate(['/pickuppoints'])
                }, error => Utils.ErrorLogger(error))
            }
        }
    }

    goBack() {
        this.router.navigate(['/pickuppoints'])
    }

    arrayLookup(lookupArray: any[], givenField: FormControl) {
        for (let x of lookupArray) {
            if (x.description.toLowerCase() == givenField.value.toLowerCase()) {
                return true;
            }
        }
    }

    updateRouteId(lookupArray: any[], e: { target: { value: any; }; }): void {
        let name = e.target.value;
        let list = lookupArray.filter(x => x.description === name)[0];

        this.form.patchValue({ routeId: list ? list.id : '' })
    }

}
