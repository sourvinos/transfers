import { Component, OnInit, AfterViewInit } from '@angular/core'
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { BsModalRef, BsModalService } from 'ngx-bootstrap'
import { forkJoin, Subject } from 'rxjs'

import { ITransfer } from '../models/transfer'
import { CustomerService } from '../services/customer.service'
import { DestinationService } from '../services/destination.service'
import { DriverService } from '../services/driver.service'
import { HelperService } from '../services/helper.service'
import { PickupPointService } from '../services/pickupPoint.service'
import { PortService } from '../services/port.service'
import { TransferService } from '../services/transfer.service'
import { Utils } from '../shared/classes/utils'
import { ModalDialogComponent } from '../shared/components/modal-dialog/modal-dialog.component'
import { ComponentInteractionService } from '../shared/services/component-interaction.service'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'

@Component({
    selector: 'app-transfer-form',
    templateUrl: './transfer-form.component.html',
    styleUrls: ['./transfer-form.component.css']
})

export class TransferFormComponent implements OnInit, AfterViewInit {

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
        remarks: ['', Validators.maxLength(100)],
        userName: [this.helperService.getUsernameFromLocalStorage()]
    })

    constructor(private destinationService: DestinationService, private customerService: CustomerService, private pickupPointService: PickupPointService, private driverService: DriverService, private portService: PortService, private transferService: TransferService, private helperService: HelperService, private componentInteractionService: ComponentInteractionService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private modalService: BsModalService) { }

    ngOnInit() {
        this.populateDropDowns()
    }

    ngAfterViewInit() {
        this.disableFields(['destination', 'customer', 'pickupPoint', 'driver', 'port', 'adults', 'kids', 'free', 'totalPersons', 'remarks', 'delete', 'save'])
    }

    // PT
    getTransfer(id: number) {
        this.transferService.getTransfer(id).subscribe(result => {
            this.populateFields(result)
            this.setRecordStatus(false)
            this.disableFields(['dateIn', 'go'])
            this.enableFields(['destination', 'customer', 'pickupPoint', 'driver', 'port', 'adults', 'kids', 'free', 'remarks', 'delete', 'save'])
            this.scrollToForm()
            this.setFocus('destination')
        })
    }

    // PT
    newRecord() {
        this.setRecordStatus(true)
        this.disableFields(['dateIn', 'go'])
        this.enableFields(['destination', 'customer', 'pickupPoint', 'driver', 'port', 'adults', 'kids', 'free', 'remarks', 'delete', 'save'])
        this.clearFields()
        this.scrollToList()
        this.scrollToForm()
        this.setFocus('destination')
    }

    // T 
    calculateTotalPersons() {
        let totalPersons = parseInt(this.form.value.adults) + parseInt(this.form.value.kids) + parseInt(this.form.value.free)
        this.form.patchValue({ totalPersons: !!Number(totalPersons) ? totalPersons : 0 })
    }

    // T 
    canDeactivate() {
        if (this.form.dirty) {
            const subject = new Subject<boolean>()
            const modal = this.modalService.show(ModalDialogComponent, {
                initialState: {
                    title: 'Confirmation',
                    message: 'If you continue, all changes in this record will be lost.',
                    type: 'question'
                }, animated: true
            })
            modal.content.subject = subject.subscribe(result => {
                if (result) {
                    this.abortDataEntry()
                }
            })
        } else {
            this.abortDataEntry()
        }
    }

    // T 
    deleteRecord() {
        const subject = new Subject<boolean>()
        const modal = this.modalService.show(ModalDialogComponent, {
            initialState: {
                title: 'Confirmation',
                message: 'If you continue, this record will be deleted.',
                type: 'delete'
            }, animated: true
        })
        modal.content.subject = subject.subscribe(result => {
            if (result)
                this.transferService.deleteTransfer(this.form.value.id).subscribe(() => {
                    this.scrollBackToList()
                    this.clearFields()
                }),
                    (error: Response) => console.log('Record NOT deleted')
        })
    }

    // T 
    isValidInput(description: FormControl, id?: { invalid: any }, lookupArray?: any[]) {
        if (id == null) return (description.invalid && description.touched)
        if (id != null) return (id.invalid && description.invalid && description.touched) || (description.touched && !this.arrayLookup(lookupArray, description))
    }

    // T 
    saveRecord() {
        if (!this.form.valid) return
        this.isSaving = true
        this.componentInteractionService.emitChange([true])
        if (this.form.value.id == 0) {
            this.transferService.addTransfer(this.form.value).subscribe(() => {
                this.clearFields()
                this.setFocus('destination')
            }, error => Utils.errorLogger(error))
        }
        else {
            this.transferService.updateTransfer(this.form.value.id, this.form.value).subscribe(() => {
                this.abortDataEntry()
            }, error => Utils.errorLogger(error))
        }
    }

    private populateFields(transfer: ITransfer) {
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

    private clearFields() {
        this.form.reset({
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

    private arrayLookup(lookupArray: any[], givenField: FormControl) {
        for (let x of lookupArray) {
            if (x.description.toLowerCase() == givenField.value.toLowerCase()) {
                return true
            }
        }
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

    private enableFields(fields: string[]) {
        Utils.enableFields(fields)
    }

    private scrollToForm() {
        this.componentInteractionService.emitChange([true])
        document.getElementById('list').style.zIndex = '-1'
        document.getElementById('list').style.marginLeft = -parseInt(document.getElementById('form').style.width) - 25 + 'px'
    }

    private setRecordStatus(status: boolean) {
        this.isNewRecord = status
    }

    private setFocus(element: string) {
        Utils.setFocus(element)
    }

    private scrollToList() {
        this.componentInteractionService.emitChange([false])
        document.getElementById('content').style.left = -parseInt(document.getElementById('empty').style.width) + 'px'
    }

    private abortDataEntry() {
        this.clearFields()
        this.disableFields(['destination', 'customer', 'pickupPoint', 'driver', 'port', 'adults', 'kids', 'free', 'totalPersons', 'remarks', 'delete', 'save'])
        this.scrollBackToList()
        this.enableFields(['dateIn', 'go'])
        this.setFocus('dateIn')
    }

    private scrollBackToList() {
        this.componentInteractionService.emitChange([false])
        document.getElementById('list').style.zIndex = '0'
        document.getElementById('list').style.marginLeft = 0 + 'px'
    }

    // #region Get field values - called from the template

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

    get adults() {
        return this.form.get('adults')
    }

    get kids() {
        return this.form.get('kids')
    }

    get free() {
        return this.form.get('free')
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

    get remarks() {
        return this.form.get('remarks')
    }

    //#endregion

    // #region Update dropdowns with values - called from the template

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

    // #endregion Update dropdowns with values

}
