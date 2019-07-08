import * as moment from 'moment'
import { Component, OnInit, AfterViewInit, Input } from '@angular/core'
import { FormBuilder, Validators, FormControl } from '@angular/forms'
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { TransferService } from '../services/transfer.service';

import { ITransfer } from '../models/transfer';
import { Utils } from '../shared/classes/utils'
import { get } from 'scriptjs';
import { DestinationService } from '../services/destination.service';
import { CustomerService } from '../services/customer.service';
import { PickupPointService } from '../services/pickupPoint.service';

@Component({
    selector: 'app-transfer-form',
    templateUrl: './transfer-form.component.html',
    styleUrls: ['../shared/styles/forms.css', './transfer-form.component.css']
})

export class TransferFormComponent implements OnInit, AfterViewInit {

    constructor(private destinationService: DestinationService, private customerService: CustomerService, private pickupPointService: PickupPointService, private transferService: TransferService, private authService: AuthService, private formBuilder: FormBuilder, private router: Router) { }

    @Input() set transfer(transfer: ITransfer) { if (transfer) this.populateFields(transfer) }

    destinations: any
    customers: any
    pickupPoints: any

    canCreate: boolean = false
    canSave: boolean = false
    canDelete: boolean = false
    canAbort: boolean = false

    @Input() public parentData: string

    form = this.formBuilder.group({
        id: 0,
        dateIn: [this.parentData], dateInput: [this.parentData],
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

    ngOnInit() {
        get('script.js', () => { });
        this.populateDropDowns()
        this.canCreate = true
        this.canSave = false
        this.canDelete = false
        this.canAbort = false
        this.form.patchValue({ dateInput: this.parentData })
        this.updateISODate()
    }

    ngAfterViewInit(): void {
        this.focusOnElement(0)
    }

    populateDropDowns() {
        let sources = []
        sources.push(this.destinationService.getDestinations())
        sources.push(this.customerService.getCustomers())
        sources.push(this.pickupPointService.getPickupPoints(2))
        return forkJoin(sources).subscribe(
            result => {
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

    disableFields() {
        this.form.controls
    }
    populateFields(transfer: ITransfer) {
        this.form.setValue({
            id: transfer.id,
            dateIn: transfer.dateIn, dateInput: moment(transfer.dateIn).format('DD/MM/YYYY'),
            destinationId: transfer.destination.id, destinationDescription: transfer.destination.description,
            customerId: transfer.customer.id, customerDescription: transfer.customer.description,
            pickupPointId: transfer.pickupPoint.id, pickupPointDescription: transfer.pickupPoint.description,
            adults: transfer.adults,
            kids: transfer.kids,
            free: transfer.free,
            totalPersons: transfer.totalPersons,
            remarks: transfer.remarks,
            user: transfer.user
        })
    }

    clearFields() {
        this.form.setValue({
            id: 0,
            dateIn: this.parentData,
            destinationId: 0, destinationDescription: '',
            customerId: 0, customerDescription: '',
            pickupPointId: 0, pickupPointDescription: '',
            adults: '',
            kids: '',
            free: '',
            totalPersons: '',
            remarks: '',
            user: ''
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
        if (this.form.value.id == null) {
            console.log("Saving...")
            this.transferService.addTransfer(this.form.value).subscribe(data => { this.router.navigate(['/transfers']) }, error => Utils.ErrorLogger(error))
        }
        else {
            console.log("Updating...")
            this.transferService.updateTransfer(this.form.value.id, this.form.value).subscribe(data => { this.router.navigate(['/transfers']), this.clearFields() }, error => Utils.ErrorLogger(error))
        }
    }

    delete() {
        if (this.form.value.id != null) {
            if (confirm('This record will permanently be deleted. Are you sure?')) {
                this.transferService.deleteTransfer(this.form.value.id).subscribe(data => this.router.navigate(['/transfers']), error => Utils.ErrorLogger(error))
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

    calculateTotalPersons() {
        this.form.patchValue({ totalPersons: parseInt(this.form.value.adults) + parseInt(this.form.value.kids) + parseInt(this.form.value.free) })
    }

}
