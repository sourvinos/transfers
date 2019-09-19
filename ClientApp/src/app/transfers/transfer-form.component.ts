import * as moment from 'moment';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CanComponentDeactivate } from './../services/auth-guard.service';
import { CustomerService } from '../services/customer.service';
import { DestinationService } from '../services/destination.service';
import { DriverService } from '../services/driver.service';
import { HelperService } from '../services/helper.service';
import { ITransfer } from '../models/transfer';
import { PickupPointService } from '../services/pickupPoint.service';
import { PortService } from '../services/port.service';
import { TransferService } from '../services/transfer.service';
import { Utils } from '../shared/classes/utils';

@Component({
    selector: 'app-transfer-form',
    templateUrl: './transfer-form.component.html',
    styleUrls: ['../shared/styles/forms.css']
})

export class TransferFormComponent implements OnInit, AfterViewInit, CanComponentDeactivate {

    constructor(private destinationService: DestinationService, private customerService: CustomerService, private pickupPointService: PickupPointService, private driverService: DriverService, private portService: PortService, private transferService: TransferService, private helperService: HelperService, private formBuilder: FormBuilder, private router: Router) { }

    @Input() set transfer(transfer: ITransfer) { if (transfer) this.populateFields(transfer) }

    destinations: any
    customers: any
    pickupPoints: any
    drivers: any
    ports: any

    canCreate: boolean = false
    canSave: boolean = false
    canDelete: boolean = false
    canAbort: boolean = false

    @Input() public parentData: string

    form = this.formBuilder.group({
        id: 0,
        dateIn: [this.parentData],
        destinationId: [0, Validators.required], destinationDescription: ['', Validators.required],
        customerId: [0, Validators.required], customerDescription: ['', Validators.required],
        pickupPointId: ['', Validators.required], pickupPointDescription: ['', Validators.required],
        driverId: ['', Validators.required], driverDescription: ['', Validators.required],
        portId: ['', Validators.required], portDescription: ['', Validators.required],
        adults: [0, Validators.required],
        kids: [0, Validators.required],
        free: [0, Validators.required],
        totalPersons: 0,
        remarks: ['']
    })

    ngOnInit() {
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
        sources.push(this.driverService.getDrivers())
        sources.push(this.portService.getPorts())
        return forkJoin(sources).subscribe(
            result => {
                this.destinations = result[0]
                this.customers = result[1]
                this.pickupPoints = result[2]
                this.drivers = result[3]
                this.ports = result[4]
            },
            error => {
                if (error.status == 404) {
                    this.router.navigate(['/error'])
                }
            }
        )
    }

    get destinationId() {
        return this.form.get('destinationId')
    }

    get destinationDescription() {
        return this.form.get('destinationDescription')
    }

    get customerId() {
        return this.form.get('customerId')
    }

    get customerDescription() {
        return this.form.get('customerDescription')
    }

    get pickupPointId() {
        return this.form.get('pickupPointId')
    }

    get pickupPointDescription() {
        return this.form.get('pickupPointDescription')
    }

    get driverId() {
        return this.form.get('driverId')
    }

    get driverDescription() {
        return this.form.get('driverDescription')
    }

    get portId() {
        return this.form.get('portId')
    }

    get portDescription() {
        return this.form.get('portDescription')
    }

    disableFields() {
        this.form.controls
    }

    populateFields(transfer: ITransfer) {
        this.form.setValue({
            id: transfer.id,
            dateIn: transfer.dateIn,
            destinationId: transfer.destination.id, destinationDescription: transfer.destination.description,
            customerId: transfer.customer.id, customerDescription: transfer.customer.description,
            pickupPointId: transfer.pickupPoint.id, pickupPointDescription: transfer.pickupPoint.description,
            driverId: transfer.driver.id, driverDescription: transfer.driver.description,
            portId: transfer.port.id, portDescription: transfer.port.description,
            adults: transfer.adults,
            kids: transfer.kids,
            free: transfer.free,
            totalPersons: transfer.totalPersons,
            remarks: transfer.remarks
        })
    }

    clearFields() {
        this.form.setValue({
            id: 0,
            dateIn: this.parentData,
            destinationId: 0, destinationDescription: '',
            customerId: 0, customerDescription: '',
            pickupPointId: 0, pickupPointDescription: '',
            driverId: 0, driverDescription: '',
            portId: 0, portDescription: '',
            adults: '',
            kids: '',
            free: '',
            totalPersons: '',
            remarks: ''
        })
    }

    getRequiredFieldMessage() {
        return 'This field is required, silly!'
    }

    getMaxLengthFieldMessage() {
        return 'This field must not be longer than '
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

    updateDriverId(lookupArray: any[], e: { target: { value: any } }): void {
        let name = e.target.value
        let list = lookupArray.filter(x => x.description === name)[0]

        this.form.patchValue({ driverId: list ? list.id : '' })
    }

    updatePortId(lookupArray: any[], e: { target: { value: any } }): void {
        let name = e.target.value
        let list = lookupArray.filter(x => x.description === name)[0]

        this.form.patchValue({ portId: list ? list.id : '' })
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

    save() {
        if (!this.form.valid) return
        this.form.value.userName = this.helperService.getUsernameFromLocalStorage()
        if (this.form.value.id == null) {
            this.transferService.addTransfer(this.form.value).subscribe(() => { this.router.navigate(['/transfers']) }, error => Utils.ErrorLogger(error))
        }
        else {
            this.transferService.updateTransfer(this.form.value.id, this.form.value).subscribe(() => {
                this.router.navigate(['/transfers'])
                this.clearFields()
            }, error => Utils.ErrorLogger(error))
        }
    }

    delete() {
        if (this.form.value.id != null) {
            if (confirm('This record will permanently be deleted. Are you sure?')) {
                this.transferService.deleteTransfer(this.form.value.id).subscribe(() => this.router.navigate(['/transfers']), error => Utils.ErrorLogger(error))
            }
        }
    }

    confirm() {
        return confirm('Are you sure?')
    }

}
