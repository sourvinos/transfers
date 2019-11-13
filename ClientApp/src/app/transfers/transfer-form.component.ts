import { AfterViewInit, Component, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material'
import { Router } from '@angular/router'
import { forkJoin } from 'rxjs'
import { ITransfer } from '../models/transfer'
import { CustomerService } from '../services/customer.service'
import { DestinationService } from '../services/destination.service'
import { DriverService } from '../services/driver.service'
import { HelperService } from '../services/helper.service'
import { PickupPointService } from '../services/pickupPoint.service'
import { PortService } from '../services/port.service'
import { TransferService } from '../services/transfer.service'
import { Utils } from '../shared/classes/utils'
import { MaterialDialogComponent } from '../shared/components/material-dialog/material-dialog.component'
import { MaterialIndexDialogComponent } from '../shared/components/material-index-dialog/material-index-dialog.component'
import { ComponentInteractionService } from '../shared/services/component-interaction.service'

@Component({
    selector: 'app-transfer-form',
    templateUrl: './transfer-form.component.html',
    styleUrls: ['./transfer-form.component.css']
})

export class TransferFormComponent implements OnInit, AfterViewInit {

    // #region Init

    id: number
    editMode: boolean = false

    tables: any[] = []

    destinations: any
    customers: any
    pickupPoints: any
    drivers: any
    ports: any

    isNewRecord: boolean = false
    isFormVisible: boolean = false

    // #endregion     

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

    constructor(private destinationService: DestinationService, private customerService: CustomerService, private pickupPointService: PickupPointService, private driverService: DriverService, private portService: PortService, private transferService: TransferService, private helperService: HelperService, private componentInteractionService: ComponentInteractionService, private formBuilder: FormBuilder, private router: Router, public dialog: MatDialog) { }

    ngOnInit() {
        this.populateDropDowns()
    }

    ngAfterViewInit() {
        this.disableFields(['destinationDescription', 'customerDescription', 'pickupPointDescription', 'adults', 'kids', 'free', 'totalPersons', 'driverDescription', 'portDescription', 'remarks', 'delete', 'save'])
    }

    // PC
    getTransfer(id: number) {
        this.transferService.getTransfer(id).subscribe(result => {
            this.populateFields(result)
            this.setRecordStatus(false)
            this.disableFields(['dateIn', 'go'])
            this.enableFields(['destinationDescription', 'customerDescription', 'pickupPointDescription', 'adults', 'kids', 'free', 'driverDescription', 'portDescription', 'remarks', 'delete', 'save'])
            this.scrollToForm()
            this.focus('destinationDescription')
        })
    }

    // PT
    newRecord() {
        this.setRecordStatus(true)
        this.disableFields(['dateIn', 'go'])
        this.enableFields(['destinationDescription', 'customerDescription', 'pickupPointDescription', 'adults', 'kids', 'free', 'driverDescription', 'portDescription', 'remarks', 'delete', 'save'])
        this.clearFields()
        this.scrollToList()
        this.scrollToForm()
        this.focus('destinationDescription')
    }

    // T 
    calculateTotalPersons() {
        let totalPersons = parseInt(this.form.value.adults) + parseInt(this.form.value.kids) + parseInt(this.form.value.free)
        this.form.patchValue({ totalPersons: !!Number(totalPersons) ? totalPersons : 0 })
    }

    // T 
    canDeactivate() {
        if (this.form.dirty) {
            const dialogRef = this.dialog.open(MaterialDialogComponent, {
                height: '250px',
                width: '550px',
                data: {
                    title: 'Please confirm',
                    message: 'If you continue, changes in this record will be lost!',
                    actions: ['cancel', 'ok']
                },
                panelClass: 'dialog'
            })
            return dialogRef.afterClosed().subscribe(result => {
                if (result == 'true') {
                    this.abortDataEntry()
                }
            })
        } else {
            this.abortDataEntry()
        }
    }

    // T
    deleteRecord() {
        if (this.form.value.id == 0 != undefined) {
            const dialogRef = this.dialog.open(MaterialDialogComponent, {
                height: '250px',
                width: '550px',
                data: {
                    title: 'Please confirm',
                    message: 'If you continue, this record will be permanently deleted.',
                    actions: ['cancel', 'ok']
                },
                panelClass: 'dialog'
            })
            dialogRef.afterClosed().subscribe(result => {
                if (result == 'true') {
                    this.transferService.deleteTransfer(this.form.value.id).subscribe(() => {
                        this.removeRow(this.form.value.id)
                        this.scrollBackToList()
                        this.clearFields()
                    }, error => {
                        Utils.errorLogger(error)
                        this.openErrorModal()
                    })
                }
            })
        }
    }

    // T
    lookupIndex(lookupArray: any[], modalTitle: string, lookupId: any, lookupDescription: any, e: { target: { value: any } }) {
        const filteredArray = []
        lookupArray.filter(x => {
            if (x.description.toUpperCase().includes(e.target.value.toUpperCase())) {
                filteredArray.push(x)
            }
        })
        if (filteredArray.length > 0) {
            this.showModalIndex(filteredArray, modalTitle, lookupId, lookupDescription)
        }
        if (filteredArray.length == 0) {
            this.focus(lookupDescription)
            this.patchFields(null, lookupId, lookupDescription)
        }
    }

    // T 
    saveRecord() {
        if (!this.form.valid) return
        this.componentInteractionService.emitChange([true])
        if (this.form.value.id == 0) {
            this.transferService.addTransfer(this.form.value).subscribe(() => {
                this.clearFields()
                this.focus('destinationDescription')
            }, error => Utils.errorLogger(error))
        }
        else {
            this.transferService.updateTransfer(this.form.value.id, this.form.value).subscribe(() => {
                this.abortDataEntry()
            }, error => Utils.errorLogger(error))
        }
    }

    private abortDataEntry() {
        this.clearFields()
        this.disableFields(['destinationDescription', 'customerDescription', 'pickupPointDescription', 'adults', 'kids', 'free', 'totalPersons', 'driverDescription', 'portDescription', 'remarks', 'delete', 'save'])
        this.scrollBackToList()
        this.enableFields(['dateIn', 'go'])
        this.focus('dateIn')
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

    private disableFields(fields: string[]) {
        Utils.disableFields(fields)
    }

    private enableFields(fields: string[]) {
        Utils.enableFields(fields)
    }

    private focus(field: string) {
        Utils.setFocus(field)
    }

    private openErrorModal() {
        this.dialog.open(MaterialDialogComponent, {
            height: '250px',
            width: '550px',
            data: {
                title: 'Error',
                message: 'This record is in use and can not be deleted.',
                actions: ['ok']
            },
            panelClass: 'dialog'
        })
    }

    private patchFields(result: any[], id: any, description: any) {
        this.form.patchValue({ [id]: result ? result[0] : '' })
        this.form.patchValue({ [description]: result ? result[1] : '' })
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

    private populateFields(transfer: ITransfer) {
        // this.id = transfer.id
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

    private removeRow(id: string) {
        document.getElementById(id).remove()
    }

    private setRecordStatus(status: boolean) {
        this.isNewRecord = status
    }

    private scrollToForm() {
        this.componentInteractionService.emitChange([true])
        document.getElementById('list').style.zIndex = '-1'
        document.getElementById('list').style.marginLeft = -parseInt(document.getElementById('form').style.width) - 25 + 'px'
    }

    private scrollBackToList() {
        this.componentInteractionService.emitChange([false])
        document.getElementById('list').style.zIndex = '0'
        document.getElementById('list').style.marginLeft = 0 + 'px'
        document.getElementById('go').click()
    }

    private scrollToList() {
        this.componentInteractionService.emitChange([false])
        document.getElementById('content').style.left = -parseInt(document.getElementById('empty').style.width) + 'px'
    }

    private showModalIndex(filteredArray: any[], modalTitle: string, lookupId: any, lookupDescription: any) {
        let dialogRef = this.dialog.open(MaterialIndexDialogComponent, {
            data: {
                header: modalTitle,
                columns: ['id', 'description'],
                fields: ['Id', 'Description'],
                align: ['center', 'left'],
                format: ['', ''],
                records: filteredArray
            }
        })
        dialogRef.afterClosed().subscribe((result) => {
            this.patchFields(result, lookupId, lookupDescription)
        })
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

    get totalPersons() {
        return this.form.get('totalPersons')
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

}
