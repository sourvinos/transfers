import { ActivatedRoute, Router } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { MatDialog, MatSnackBar } from '@angular/material'
import { forkJoin } from 'rxjs'

import { DeleteDialogComponent } from '../shared/components/delete-dialog/delete-dialog.component'
import { IPickupPoint } from '../models/pickupPoint'
import { PickupPointService } from '../services/pickupPoint.service'
import { Utils } from '../shared/classes/utils';

@Component({
    selector: 'pickupPoint-customer-form',
    templateUrl: './pickupPoint-form.component.html',
    styleUrls: ['./pickupPoint-form.component.css', '../shared/styles/input-forms.css']
})

export class PickupPointFormComponent implements OnInit {

    routes: any
    pickupPoints: any

    pickupPoint: IPickupPoint = {
        id: null,
        routeId: null,
        description: '',
        exactPoint: '',
        time: '',
        user: '',
    }

    homeURL: string = '/pickuppoints'
    isNewRecord: boolean = true
    subHeader: string = ''

    constructor(private service: PickupPointService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private dialog: MatDialog) {
        route.params.subscribe(p => (this.pickupPoint.id = p['id']))
    }

    ngOnInit() {
        let sources = [this.service.getRoutes()]
        if (this.pickupPoint.id) {
            sources.push(this.service.getPickupPoint(this.pickupPoint.id))
        }
        return forkJoin(sources).subscribe(
            result => {
                this.routes = result[0]
                if (this.pickupPoint.id) {
                    this.setPickupPoint(result[1] as {
                        id: number
                        routeId: number
                        description: string
                        exactPoint: string
                        time: string
                        user: string
                    })
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

    private setPickupPoint(v: IPickupPoint) {
        this.pickupPoint.id = v.id
        this.pickupPoint.routeId = v.routeId
        this.pickupPoint.description = v.description
        this.pickupPoint.exactPoint = v.exactPoint
        this.pickupPoint.time = v.time
        this.pickupPoint.user = v.user
    }

    private populateRoutes() {
        const selectedRoute = this.routes.find((x: { id: any }) => x.id == this.pickupPoint.routeId)
        this.pickupPoints = selectedRoute ? selectedRoute.pickupPoints : []
    }

    save() {
        console.log(this.pickupPoint.id)
        if (this.pickupPoint.id == null) {
            this.service.addPickupPoint(this.form.value).subscribe(data => this.router.navigate(['/pickuppoints']), error => Utils.ErrorLogger(error));
        } else {
            this.service.updateRoute(this.form.value.id, this.form.value).subscribe(data => this.router.navigate(['/routes']), error => Utils.ErrorLogger(error));
        }
    }


}
