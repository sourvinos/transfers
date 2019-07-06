import * as moment from 'moment'
import { ActivatedRoute, Router } from '@angular/router'
import { Component, OnInit, AfterViewInit } from '@angular/core'
import { FormBuilder, Validators, FormControl } from '@angular/forms'
import { forkJoin } from 'rxjs'

import { AuthService } from '../services/auth.service';
import { CustomerService } from '../services/customer.service'
import { DestinationService } from '../services/destination.service';
import { PickupPointService } from '../services/pickupPoint.service';
import { TransferService } from '../services/transfer.service';

import { Utils } from '../shared/classes/utils'
import { get } from 'scriptjs';

@Component({
    selector: 'app-transfer-form',
    templateUrl: './transfer-form.component.html',
    styleUrls: ['../shared/styles/forms.css']
})

export class TransferFormComponent implements OnInit, AfterViewInit {

    destinations: any
    customers: any
    pickupPoints: any

    id: number = null

    form = this.formBuilder.group({
        id: 0,
        dateIn: ['', [Validators.required]], dateInput: ['', [Validators.required]],
        destinationId: [0, Validators.required], destinationDescription: ['', Validators.required],
        customerId: [0, Validators.required], customerDescription: ['', Validators.required],
        pickupPointId: ['', Validators.required], pickupPointDescription: ['', Validators.required],
        adults: [0, Validators.required],
        kids: [0, Validators.required],
        free: [0, Validators.required],
        totalPersons: 0,
        remarks: [''],
        user: [this.getUserName()]
    })

    constructor(private destinationService: DestinationService, private customerService: CustomerService, private pickupPointService: PickupPointService, private transferService: TransferService, private authService: AuthService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {
        route.params.subscribe(p => (this.id = p['id']))
    }

    ngOnInit() {

        get('script.js', () => { });

        let sources = []

        sources.push(this.destinationService.getDestinations())
        sources.push(this.customerService.getCustomers())
        sources.push(this.pickupPointService.getPickupPoints(2))

        if (this.id) {
            sources.push(this.transferService.getTransfer(this.id))
        }

        return forkJoin(sources).subscribe(
            result => {
                if (this.id) {
                    this.populateFields()
                }
                this.destinations = result[0]
                this.customers = result[1]
                this.pickupPoints = result[2]
            },
            error => {
                if (error.status == 404) {
                    this.router.navigate(['/error'])
                }
            }

        )
    }

    ngAfterViewInit(): void {
        this.focusOnElement(0)
    }


    populateFields() {
        this.transferService.getTransfer(this.id).subscribe(
            result => {
                this.form.setValue({
                    id: result.id,
                    dateIn: result.dateIn, dateInput: moment(result.dateIn).format('DD/MM/YYYY'),
                    destinationId: result.destination.id, destinationDescription: result.destination.description,
                    customerId: result.customer.id, customerDescription: result.customer.description,
                    pickupPointId: result.pickupPoint.id, pickupPointDescription: result.pickupPoint.description,
                    adults: result.adults,
                    kids: result.kids,
                    free: result.free,
                    totalPersons: result.totalPersons,
                    remarks: result.remarks,
                    user: result.user
                })

            },
            error => {
                Utils.ErrorLogger(error)
            })
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
            this.transferService.addTransfer(this.form.value).subscribe(data => this.router.navigate(['/transfers']), error => Utils.ErrorLogger(error))
        }
        else {
            this.transferService.updateTransfer(this.form.value.id, this.form.value).subscribe(data => this.router.navigate(['/transfers']), error => Utils.ErrorLogger(error))
        }
    }

    delete() {
        if (this.id != null) {
            if (confirm('This record will permanently be deleted. Are you sure?')) {
                this.transferService.deleteTransfer(this.id).subscribe(data => this.router.navigate(['/transfers']), error => Utils.ErrorLogger(error))
            }
        }
    }

    goBack() {
        this.router.navigate(['/transfers'])
    }

    arrayLookup(lookupArray: any[], givenField: FormControl) {
        for (let x of lookupArray) {
            if (x.description.toLowerCase() == givenField.value.toLowerCase()) {
                return true
            }
        }
    }

    updateDestinationId(lookupArray: any[], e: { target: { value: any } }): void {
        let name = e.target.value
        let list = lookupArray.filter(x => x.description === name)[0]

        this.form.patchValue({ destinationId: list ? list.id : '' })
    }

    updateCustomerId(lookupArray: any[], e: { target: { value: any } }): void {
        let name = e.target.value
        let list = lookupArray.filter(x => x.description === name)[0]

        this.form.patchValue({ customerId: list ? list.id : '' })
    }

    updatePickupPointId(lookupArray: any[], e: { target: { value: any } }): void {
        let name = e.target.value
        let list = lookupArray.filter(x => x.description === name)[0]

        this.form.patchValue({ pickupPointId: list ? list.id : '' })
    }

    getUserName() {
        let token = this.authService.getDecodedToken();
        let userName = token['sub'];

        return userName;
    }

    updateISODate() {
        this.form.patchValue({ dateIn: moment(this.form.value.dateInput, 'DD-MM-YYYY').toISOString(true) })
    }

    focusOnElement(index: number) {
        var elements = document.getElementsByTagName('input')
        elements[index].select()
        elements[index].focus()
    }

}
