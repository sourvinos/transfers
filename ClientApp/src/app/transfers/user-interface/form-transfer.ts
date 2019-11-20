import { ITransfer } from './../classes/model-transfer';
import { PickupPointService } from './../../services/pickupPoint.service';
import { Component, OnDestroy, AfterViewInit, OnInit } from "@angular/core"
import { Unlisten, KeyboardShortcuts } from "src/app/services/keyboard-shortcuts.service"
import { Validators, FormBuilder } from "@angular/forms"
import { DestinationService } from "src/app/services/destination.service"
import { CustomerService } from "src/app/services/customer.service"
import { DriverService } from 'src/app/services/driver.service';
import { PortService } from 'src/app/services/port.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferService } from '../classes/service-transfer';
import { MatDialog } from '@angular/material';
import { HelperService } from 'src/app/services/helper.service';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { Utils } from 'src/app/shared/classes/utils';
import { forkJoin } from 'rxjs';
import { MaterialIndexDialogComponent } from 'src/app/shared/components/material-index-dialog/material-index-dialog.component';

@Component({
    selector: 'app-transfer-form',
    templateUrl: './form-transfer.html',
    styleUrls: ['./form-transfer.css']
})

export class TransferFormComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Variables

    id: number
    transfer: ITransfer
    url: string = '/transfers'

    destinations: any[]
    customers: any[]
    pickupPoints: any[]
    drivers: any[]
    ports: any[]

    unlisten: Unlisten

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

    // #endregion Variables

    constructor(private destinationService: DestinationService, private customerService: CustomerService, private pickupPointService: PickupPointService, private driverService: DriverService, private portService: PortService, private activatedRoute: ActivatedRoute, private router: Router, private transferService: TransferService, private formBuilder: FormBuilder, public dialog: MatDialog, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts) {
        this.activatedRoute.params.subscribe(p => {
            this.id = p['transferId']
            if (this.id) {
                this.getTransfer()
            }
        })
        this.unlisten = null
    }

    ngOnInit() {
        this.scrollToForm()
        this.addShortcuts()
        this.populateDropDowns()
    }

    ngAfterViewInit(): void {
        this.focus('destinationDescription')
    }

    ngOnDestroy(): void {
        (this.unlisten) && this.unlisten()
    }

    // Master
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
                if (result == "true") {
                    this.form.reset()
                    this.scrollToList()
                    this.goBack()
                }
            })
        } else {
            this.scrollToList()
            return true
        }
    }

    // T
    calculateTotalPersons() {
        let totalPersons = parseInt(this.form.value.adults) + parseInt(this.form.value.kids) + parseInt(this.form.value.free)
        this.form.patchValue({ totalPersons: !!Number(totalPersons) ? totalPersons : 0 })
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

    // T
    goBack() {
        this.router.navigate(['../../'], { relativeTo: this.activatedRoute })
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
        if (!this.id) {
            this.transferService.addTransfer(this.form.value).subscribe(() => {
                this.clearFields()
                this.focus('destinationDescription')
            }, error => Utils.errorLogger(error))
        }
        else {
            this.transferService.updateTransfer(this.form.value.id, this.form.value).subscribe(() => {
                this.abortDataEntry()
                this.goBack()
            }, error => Utils.errorLogger(error))
        }
    }

    private abortDataEntry() {
        this.clearFields()
        this.disableFields(['destinationDescription', 'customerDescription', 'pickupPointDescription', 'adults', 'kids', 'free', 'totalPersons', 'driverDescription', 'portDescription', 'remarks', 'delete', 'save'])
        // this.enableFields(['dateIn', 'go'])
        // this.focus('dateIn')
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            "Escape": (event: KeyboardEvent): void => {
                if (document.getElementsByClassName('cdk-overlay-pane').length == 0) {
                    this.goBack()
                }
            },
            "Alt.D": (event: KeyboardEvent): void => {
                event.preventDefault()
                this.deleteRecord()
            },
            "Alt.S": (event: KeyboardEvent): void => {
                this.saveRecord()
            },
            "Alt.C": (event: KeyboardEvent): void => {
                if (document.getElementsByClassName('cdk-overlay-pane').length != 0) {
                    document.getElementById('cancel').click()
                }
            },
            "Alt.O": (event: KeyboardEvent): void => {
                if (document.getElementsByClassName('cdk-overlay-pane').length != 0) {
                    document.getElementById('ok').click()
                }
            }
        }, {
            priority: 2,
            inputs: true
        })
    }

    private focus(field: string) {
        Utils.setFocus(field)
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

    private showModalIndex(filteredArray: any[], modalTitle: string, lookupId: any, lookupDescription: any) {
        let dialogRef = this.dialog.open(MaterialIndexDialogComponent, {
            height: '686px',
            width: '700px',
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

    private patchFields(result: any[], id: any, description: any) {
        this.form.patchValue({ [id]: result ? result[0] : '' })
        this.form.patchValue({ [description]: result ? result[1] : '' })
    }

    private populateFields(result: ITransfer) {
        console.log(result)
        this.form.setValue({
            id: result.id,
            dateIn: result.dateIn,
            destinationId: result.destination.id, destinationDescription: result.destination.description,
            customerId: result.customer.id, customerDescription: result.customer.description,
            pickupPointId: result.pickupPoint.id, pickupPointDescription: result.pickupPoint.description,
            driverId: result.driver.id, driverDescription: result.driver.description,
            portId: result.port.id, portDescription: result.port.description,
            adults: result.adults,
            kids: result.kids,
            free: result.free,
            totalPersons: result.totalPersons,
            remarks: result.remarks,
            userName: result.userName
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

    // #endregion

    private getTransfer() {
        if (this.id) {
            this.transferService.getTransfer(this.id).subscribe(result => {
                this.transfer = result
                this.populateFields(this.transfer)
                this.scrollToForm()
            }, error => {
                console.log('Error getting record')
            })
        }

    }

    private scrollToForm() {
        document.getElementById('transfersList').style.height = '0px'
    }

    private scrollToList() {
        document.getElementById('form').style.height = '0px'
        document.getElementById('transfersList').style.height = '100%'
    }

}
