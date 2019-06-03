import { ActivatedRoute, Router } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, Validators, FormControl } from '@angular/forms'
import { forkJoin } from 'rxjs'
import * as moment from 'moment'

import { AuthService } from '../services/auth.service';
import { CustomerService } from '../services/customer.service'
import { DestinationService } from '../services/destination.service';
import { PickupPointService } from '../services/pickupPoint.service';
import { TransferService } from '../services/transfer.service';
import { TransferTypeService } from '../services/transferType.service';

import { Utils } from '../shared/classes/utils'
import { get } from 'scriptjs';

@Component({
    selector: 'app-transfer-form',
    templateUrl: './transfer-form.component.html',
    styleUrls: ['../shared/styles/forms.css']
})

export class TransferFormComponent implements OnInit {

    customers: any
    transferTypes: any
    destinations: any
    pickupPoints: any

    id: number = null

    form = this.formBuilder.group({
        id: 0,
        dateIn: ['', [Validators.required]],
        dateInput: ['', [Validators.required]],
        customerId: [0, Validators.required],
        customerDescription: ['', Validators.required],
        transferTypeId: ['', Validators.required],
        transferTypeDescription: ['', Validators.required],
        pickupPointId: ['', Validators.required],
        pickupPointDescription: ['', Validators.required],
        adults: [0, Validators.required],
        kids: [0, Validators.required],
        free: [0, Validators.required],
        destinationId: [0, Validators.required],
        destinationDescription: ['', Validators.required],
        remarks: [''],
        user: [this.getUserName()]
    })

    constructor(private customerService: CustomerService, private transferTypeService: TransferTypeService, private pickupPointService: PickupPointService, private destinationService: DestinationService, private transferService: TransferService, private authService: AuthService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {
        route.params.subscribe(p => (this.id = p['id']))
    }

    ngOnInit() {

        get('script.js', () => { });

        let sources = []

        sources.push(this.customerService.getCustomers())
        sources.push(this.transferTypeService.getTransferTypes())
        sources.push(this.pickupPointService.getPickupPoints(2))
        sources.push(this.destinationService.getDestinations())

        if (this.id) {
            sources.push(this.transferService.getTransfer(this.id))
        }

        return forkJoin(sources).subscribe(
            result => {
                this.customers = result[0]
                this.transferTypes = result[1]
                this.pickupPoints = result[2]
                this.destinations = result[3]
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
        this.transferService.getTransfer(this.id).subscribe(
            result => {
                this.form.setValue({
                    id: result.id,
                    dateIn: result.dateIn,
                    dateInput: moment(result.dateIn).format('DD/MM/YYYY'),
                    customerId: result.customer.id,
                    customerDescription: result.customer.description,
                    transferTypeId: result.transferType.id,
                    transferTypeDescription: result.transferType.description,
                    pickupPointId: result.pickupPoint.id,
                    pickupPointDescription: result.pickupPoint.description,
                    adults: result.adults,
                    kids: result.kids,
                    free: result.free,
                    destinationId: result.destination.id,
                    destinationDescription: result.destination.description,
                    remarks: result.remarks,
                    user: result.user
                })

            },
            error => {
                Utils.ErrorLogger(error)
            })
    }

    get description() {
        return this.form.get('description')
    }

    get profession() {
        return this.form.get('profession')
    }

    get address() {
        return this.form.get('address')
    }

    get phones() {
        return this.form.get('phones')
    }

    get personInCharge() {
        return this.form.get('personInCharge')
    }

    get email() {
        return this.form.get('email')
    }

    get taxNo() {
        return this.form.get('taxNo')
    }

    get accountCode() {
        return this.form.get('accountCode')
    }

    get taxOfficeId() {
        return this.form.get('taxOfficeId')
    }

    get taxOfficeDescription() {
        return this.form.get('taxOfficeDescription')
    }

    get vatStateId() {
        return this.form.get('vatStateId')
    }

    get vatStateDescription() {
        return this.form.get('vatStateDescription')
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

    updateCustomerId(lookupArray: any[], e: { target: { value: any } }): void {
        let name = e.target.value
        let list = lookupArray.filter(x => x.description === name)[0]

        this.form.patchValue({ customerId: list ? list.id : '' })
    }

    updateTransferTypeId(lookupArray: any[], e: { target: { value: any } }): void {
        let name = e.target.value
        let list = lookupArray.filter(x => x.description === name)[0]

        this.form.patchValue({ transferTypeId: list ? list.id : '' })
    }

    updatePickupPointId(lookupArray: any[], e: { target: { value: any } }): void {
        let name = e.target.value
        let list = lookupArray.filter(x => x.description === name)[0]

        this.form.patchValue({ pickupPointId: list ? list.id : '' })
    }

    updateDestinationId(lookupArray: any[], e: { target: { value: any } }): void {
        let name = e.target.value
        let list = lookupArray.filter(x => x.description === name)[0]

        this.form.patchValue({ DestinationId: list ? list.id : '' })
    }

    getUserName() {
        let token = this.authService.getDecodedToken();
        let userName = token['sub'];

        return userName;
    }

    updateISODate() {
        this.form.patchValue({ dateIn: moment(this.form.value.dateInput, 'DD-MM-YYYY').toISOString(true) })
    }

}
