import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DestinationService } from 'src/app/services/destination.service';
import { CustomerService } from 'src/app/services/customer.service';
import { PickupPointService } from 'src/app/services/pickupPoint.service';
import { PortService } from 'src/app/services/port.service';
import { HelperService } from 'src/app/services/helper.service';
import { ITransfer } from '../classes/model-transfer';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferService } from '../classes/service-transfer';
import { Utils } from 'src/app/shared/classes/utils';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { MaterialIndexDialogComponent } from 'src/app/shared/components/material-index-dialog/material-index-dialog.component';
import { forkJoin } from 'rxjs';
import { DriverService } from 'src/app/services/driver.service';

@Component({
    selector: 'modal-form',
    templateUrl: 'modal-form.html',
    styleUrls: ['../../shared/styles/forms.css', 'modal-form.css']
})

export class ModalTransferFormComponent {

    transfer: ITransfer
    isNewRecord: boolean = false

    tables: any[] = []

    destinations: any
    customers: any
    pickupPoints: any
    drivers: any
    ports: any

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

    constructor(private destinationService: DestinationService, private customerService: CustomerService, private pickupPointService: PickupPointService, private driverService: DriverService, private portService: PortService, private helperService: HelperService, public dialogRef: MatDialogRef<ModalTransferFormComponent>, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private transferService: TransferService, public dialog: MatDialog, private router: Router, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.populateFields()
    }

    close(): void {
        this.dialogRef.close();
    }

    closeAndReturnObject() {
        this.dialogRef.close(this.form.value)
    }

    private populateFields() {
        this.transfer = this.data.transfer
        this.form.setValue({
            id: this.transfer.id,
            dateIn: this.transfer.dateIn,
            destinationId: this.transfer.destination.id, destinationDescription: this.transfer.destination.description,
            customerId: this.transfer.customer.id, customerDescription: this.transfer.customer.description,
            pickupPointId: this.transfer.pickupPoint.id, pickupPointDescription: this.transfer.pickupPoint.description,
            driverId: this.transfer.driver.id, driverDescription: this.transfer.driver.description,
            portId: this.transfer.port.id, portDescription: this.transfer.port.description,
            adults: this.transfer.adults,
            kids: this.transfer.kids,
            free: this.transfer.free,
            totalPersons: this.transfer.totalPersons,
            remarks: this.transfer.remarks,
            userName: this.transfer.userName
        })
    }

    private setRecordStatus(status: boolean) {
        this.isNewRecord = status
    }

    newRecord() {
        this.setRecordStatus(true)
        this.disableFields(['dateIn', 'go'])
        this.enableFields(['destinationDescription', 'customerDescription', 'pickupPointDescription', 'adults', 'kids', 'free', 'driverDescription', 'portDescription', 'remarks', 'delete', 'save'])
        this.clearFields()
        this.focus('destinationDescription')
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
                        // this.removeRow(this.form.value.id)
                        // this.clearFields()
                    }, error => {
                        Utils.errorLogger(error)
                        this.openErrorModal()
                    })
                }
            })
        }
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

    calculateTotalPersons() {
        let totalPersons = parseInt(this.form.value.adults) + parseInt(this.form.value.kids) + parseInt(this.form.value.free)
        this.form.patchValue({ totalPersons: !!Number(totalPersons) ? totalPersons : 0 })
    }

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

    private abortDataEntry() {
        this.clearFields()
        this.disableFields(['destinationDescription', 'customerDescription', 'pickupPointDescription', 'adults', 'kids', 'free', 'totalPersons', 'driverDescription', 'portDescription', 'remarks', 'delete', 'save'])
        this.enableFields(['dateIn', 'go'])
        this.focus('dateIn')
    }

    private patchFields(result: any[], id: any, description: any) {
        this.form.patchValue({ [id]: result ? result[0] : '' })
        this.form.patchValue({ [description]: result ? result[1] : '' })
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
