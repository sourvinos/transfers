import { HelperService } from './../services/helper.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap'
import { DestinationService } from '../services/destination.service';
import { CustomerService } from '../services/customer.service';
import { PickupPointService } from '../services/pickupPoint.service';
import { PortService } from '../services/port.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ComponentInteractionService } from '../shared/services/component-interaction.service';
import { TransferService } from '../services/transfer.service';
import { ITransfer } from '../models/transfer';
import { Utils } from '../shared/classes/utils';
import { DriverService } from '../services/driver.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-transfer-test',
    templateUrl: './transfer-test.component.html',
    styleUrls: ['./transfer-test.component.css']
})

export class TransferTestComponent implements OnInit {

    id: number
    editMode: boolean = false

    destinations: any
    customers: any
    pickupPoints: any
    drivers: any
    ports: any

    isNewRecord: boolean = false
    isSaving: boolean = false
    isFormVisible: boolean = false
    modalRef: BsModalRef

    constructor(private destinationService: DestinationService, private customerService: CustomerService, private pickupPointService: PickupPointService, private driverService: DriverService, private portService: PortService, private transferService: TransferService, private helperService: HelperService, private componentInteractionService: ComponentInteractionService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private modalService: BsModalService) { }

    ngOnInit() {
        this.populateDropDowns()
        this.disableFields(['destination'])
        this.route.params.subscribe((params: Params) => {
            if (params['id'] != null) {
                this.id = +params['id']
                this.editMode = params['id'] != null
                this.transferService.getTransfer(this.id).subscribe(result => {
                    this.editRecord(result)
                })
            } else {
                this.newRecord()
            }
        })
    }


    form = this.formBuilder.group({
        id: 0,
        dateIn: [this.helperService.getDateFromLocalStorage()],
        destinationId: [0, Validators.required], destinationDescription: ['', Validators.required],
        customerId: [0, Validators.required], customerDescription: ['', Validators.required],
        pickupPointId: ['', Validators.required], pickupPointDescription: ['', Validators.required],
        driverId: ['', Validators.required], driverDescription: ['', Validators.required],
        portId: ['', Validators.required], portDescription: ['', Validators.required],
        adults: [0, Validators.required],
        kids: [0, Validators.required],
        free: [0, Validators.required],
        totalPersons: 0,
        remarks: [''],
        userName: [this.helperService.getUsernameFromLocalStorage()]
    })

    getTransfer(id: number) {
        document.getElementById('list').style.marginLeft = -parseInt(document.getElementById('form').style.width) - 25 + 'px'
    }

    onCancel() {
        document.getElementById('list').style.marginLeft = 0 + 'px'
    }

    private populateDropDowns() {
        let sources = []
        sources.push(this.destinationService.getDestinations())
        sources.push(this.customerService.getCustomers())
        sources.push(this.pickupPointService.getAllPickupPoints())
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

    private disableFields(fields: string[]) {
        Utils.disableFields(fields)
    }

    editRecord(transfer: ITransfer) {
        this.populateFields(transfer)
        this.setRecordStatus(false)
        // this.enableFields(['destination'])
        // this.scrollToForm()
        this.setFocus('destination')
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
            remarks: transfer.remarks,
            userName: transfer.userName
        })
    }

    private setRecordStatus(status: boolean) {
        this.isNewRecord = status
    }

    private enableFields(fields: string[]) {
        Utils.enableFields(fields)
    }

    private setFocus(element: string) {
        Utils.setFocus(element)
    }

    newRecord() {
        this.clearFields()
        this.setRecordStatus(true)
        this.enableFields(['destination'])
        this.scrollToForm()
        this.setFocus('destination')
    }

    clearFields() {
        this.form.setValue({
            id: 0,
            dateIn: this.helperService.getDateFromLocalStorage(),
            destinationId: 0, destinationDescription: '',
            customerId: 0, customerDescription: '',
            pickupPointId: 0, pickupPointDescription: '',
            driverId: 0, driverDescription: '',
            portId: 0, portDescription: '',
            adults: '0',
            kids: '0',
            free: '0',
            totalPersons: '0',
            remarks: '',
            userName: this.helperService.getUsernameFromLocalStorage()
        })
    }

    private scrollToForm() {
        document.getElementById('list').style.marginLeft = -parseInt(document.getElementById('form').style.width) - 25 + 'px'
    }

    updateDestinationId(lookupArray: any[], e: { target: { value: any } }): void {
        let name = e.target.value
        let list = lookupArray.filter(x => x.description === name)[0]

        this.form.patchValue({ destinationId: list ? list.id : '' })
    }

}
