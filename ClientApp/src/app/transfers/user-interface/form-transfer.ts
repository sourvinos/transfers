import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CustomerService } from "src/app/services/customer.service";
import { DestinationService } from "src/app/services/destination.service";
import { DriverService } from 'src/app/services/driver.service';
import { HelperService } from 'src/app/services/helper.service';
import { KeyboardShortcuts, Unlisten } from "src/app/services/keyboard-shortcuts.service";
import { PortService } from 'src/app/services/port.service';
import { Utils } from 'src/app/shared/classes/utils';
import { DialogAlertComponent } from "src/app/shared/components/dialog-alert/dialog-alert.component";
import { DialogIndexComponent } from "src/app/shared/components/dialog-index/dialog-index.component";
import { TransferService } from '../classes/service-api-transfer';
import { InteractionTransferService } from "../classes/service-interaction-transfer";
import { PickupPointService } from './../../services/pickupPoint.service';
import { ITransfer } from './../classes/model-transfer';

@Component({
    selector: 'form-transfer',
    templateUrl: './form-transfer.html',
    styleUrls: ['./form-transfer.css']
})

export class FormTransferComponent implements OnInit, AfterViewInit, OnDestroy {

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

    constructor(private destinationService: DestinationService, private customerService: CustomerService, private pickupPointService: PickupPointService, private driverService: DriverService, private portService: PortService, private activatedRoute: ActivatedRoute, private router: Router, private transferService: TransferService, private formBuilder: FormBuilder, public dialog: MatDialog, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private interactionTransferService: InteractionTransferService) {
        this.activatedRoute.params.subscribe(p => {
            this.id = p['transferId']
            if (this.id) {
                this.getTransfer()
                this.interactionTransferService.sendData('editRecord')
            } else {
                this.populateFormWithData()
                this.interactionTransferService.sendData('newRecord')
            }
        })
    }

    ngOnInit() {
        this.scrollToForm()
        this.addShortcuts()
        this.populateDropDowns()
        this.subscribeToInderactionService()
    }

    ngAfterViewInit(): void {
        this.focus('destinationDescription')
    }

    ngOnDestroy(): void {
        this.unlisten && this.unlisten()
    }

    // Master
    canDeactivate() {
        if (this.form.dirty) {
            const dialogRef = this.dialog.open(DialogAlertComponent, {
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
                    this.enableFields(['dateIn'])
                    this.scrollToList()
                    this.goBack()
                }
            })
        } else {
            this.enableFields(['dateIn'])
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
            const dialogRef = this.dialog.open(DialogAlertComponent, {
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
                        this.abortDataEntry()
                        this.goBack()
                    }, error => {
                        Utils.errorLogger(error)
                        this.openErrorModal()
                    })
                }
            })
        }
    }

    // T
    lookupIndex(lookupArray: any[], title: string, formFields: any[], fields: any[], headers: any[], widths: any[], visibility: any[], justify: any[], value: { target: { value: any } }) {
        const filteredArray = []
        lookupArray.filter(x => {
            if (x.description.toUpperCase().includes(value.target.value.toUpperCase())) {
                filteredArray.push(x)
            }
        })
        if (filteredArray.length > 0) {
            this.showModalIndex(filteredArray, title, formFields, fields, headers, widths, visibility, justify)
        }
        if (filteredArray.length == 0) {
            this.patchFields(null, formFields[0], formFields[1])
            this.focus(formFields[1])
        }
    }

    // T
    saveRecord() {
        if (!this.form.valid) return
        if (this.form.value.id == 0) {
            this.transferService.addTransfer(this.form.value).subscribe(() => {
                this.abortDataEntry()
                this.goBack()
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
        this.disableFields(['destinationDescription', 'customerDescription', 'pickupPointDescription', 'adults', 'kids', 'free', 'totalPersons', 'driverDescription', 'portDescription', 'remarks'])
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            "Escape": (): void => {
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

    private goBack() {
        this.interactionTransferService.sendData('')
        this.router.navigate(['../../'], { relativeTo: this.activatedRoute })
    }

    private openErrorModal() {
        this.dialog.open(DialogAlertComponent, {
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

    private patchFields(result: any, id: any, description: any) {
        this.form.patchValue({ [id]: result ? result.id : '' })
        this.form.patchValue({ [description]: result ? result.description : '' })
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

    private populateFields(result: ITransfer) {
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

    private populateFormWithData() {
        this.form.setValue({
            id: 0,
            dateIn: '2019-10-01',
            destinationId: 3, destinationDescription: 'BLUE LAGOON',
            customerId: 10, customerDescription: 'ISLAND HOLIDAYS',
            pickupPointId: 865, pickupPointDescription: 'ISLAND HOLIDAYS',
            driverId: 9, driverDescription: 'MED BLUE VASILIS',
            portId: 2, portDescription: 'LEFKIMMI PORT',
            adults: 3,
            kids: 2,
            free: 1,
            totalPersons: 6,
            remarks: 'No remarks',
            userName: 'Sourvinos'
        })
    }

    private scrollToForm() {
        document.getElementById('transfersList').style.height = '0'
    }

    private scrollToList() {
        document.getElementById('form').style.height = '0'
        document.getElementById('transfersList').style.height = '100%'
    }

    private showModalIndex(
        elements: any,
        title: string,
        formFields: any[],
        fields: any[],
        headers: any[],
        widths: any[],
        visibility: any[],
        justify: any[]) {
        const dialog = this.dialog.open(DialogIndexComponent, {
            height: '640px',
            width: '600px',
            data: {
                records: elements,
                title: title,
                fields: fields,
                headers: headers,
                widths: widths,
                visibility: visibility,
                justify: justify
            }
        })
        dialog.afterClosed().subscribe((result) => {
            this.patchFields(result, formFields[0], formFields[1])
        })
    }

    /**
     * Accepts data from the wrapper when buttons are clicked
     */
    private subscribeToInderactionService() {
        this.interactionTransferService.data.subscribe(response => {
            if (response == 'saveRecord') this.saveRecord()
            if (response == 'deleteRecord') this.deleteRecord()
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

}
