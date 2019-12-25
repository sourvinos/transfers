import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CustomerService } from "src/app/customers/classes/service-api-customer";
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
                this.interactionTransferService.setRecordStatus('editRecord')
            } else {
                this.populateFormWithData()
                this.interactionTransferService.setRecordStatus('newRecord')
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

    /**
     * Caller(s):
     *  Service - CanDeactivateGuard()
     * 
     * Description:
     *  Desides which action to perform when a route change is requested
     */
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
                    this.scrollToList('aborted from dirty form')
                    this.goBack()
                    return true
                }
            })
        } else {
            this.scrollToList('aborted from clean form')
            return true
        }
    }

    /**
     * Caller(s):
     *  Template - calculateTotalPersons()
     * 
     * Description:
     *  Calculates the total persons for the transfer
     */
    calculateTotalPersons() {
        let totalPersons = parseInt(this.form.value.adults) + parseInt(this.form.value.kids) + parseInt(this.form.value.free)
        this.form.patchValue({ totalPersons: !!Number(totalPersons) ? totalPersons : 0 })
    }

    /**
     * Caller(s):
     *  Class - subscribeToInderactionService()
     * 
     * Description:
     *  Deletes the current record
     */
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

    /**
     * Caller:
     *  Template - lookupIndex()
     * Description:
     *  Filters the given array according to the user input and displays a table to select a record
     * 
     * @param lookupArray 
     * @param title 
     * @param formFields 
     * @param fields 
     * @param headers 
     * @param widths 
     * @param visibility 
     * @param justify 
     * @param value 
     */
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

    /**
     * Caller:
     *  Class - subscribeToInderactionService()
     * 
     * Description:
     *  Adds a new record or updates the current
     */
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

    /**
     * Caller:
     *  Class - saveRecord(), deleteRecord()
     * Description:
     *  Housekeeping actions
     */
    private abortDataEntry() {
        this.clearFields()
        this.disableFields(['destinationDescription', 'customerDescription', 'pickupPointDescription', 'adults', 'kids', 'free', 'totalPersons', 'driverDescription', 'portDescription', 'remarks'])
    }

    /**
     * Caller:
     *  Class - ngOnInit()
     * Description:
     *  Adds keyboard shortcuts
     */
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

    /**
     * Caller:
     *  Class - abortDataEntry()
     * Description:
     *  Resets the form with default values
     */
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

    /**
     * Caller:
     *  Class - abortDataEntry()
     * Description:
     *  Calls the public method
     * @param fields 
     */
    private disableFields(fields: string[]) {
        Utils.disableFields(fields)
    }

    /**
     * Caller:
     *  Class - canDeactivate()
     * Description:
     *  Calls the public enableFields()
     * 
     * @param fields 
     */
    private enableFields(fields: string[]) {
        Utils.enableFields(fields)
    }

    /**
     * Caller:
     *  Class - ngAfterViewInit()
     * Description
     *  Calls the public focus()
     * 
     * @param field 
     */
    private focus(field: string) {
        Utils.setFocus(field)
    }

    /**
     * Caller(s):
     *  Class - constructor()
     * 
     * Description:
     *  Gets the selected record from the api
     */
    private getTransfer() {
        if (this.id) {
            this.transferService.getTransfer(this.id).subscribe(result => {
                this.transfer = result
                this.populateFields(this.transfer)
            }, error => {
                console.log('Error getting record')
            })
        }
    }

    /**
     * Caller(s): 
     *  Class - canDeactive(), deleteRecord(), saveRecord()
     * 
     * Description:
     *  Send 'empty' to the setRecordStatus, so that the wrapper will display the 'new' button
     *  On escape navigates to the list
     */
    private goBack() {
        this.interactionTransferService.setRecordStatus('empty')
        this.router.navigate(['../../'], { relativeTo: this.activatedRoute })
    }

    /**
     * Caller:
     *  Class - deleteRecord()
     * Description:
     *  Displays a modal window with an alert if the delete action fails
     */
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

    /**
     * Caller:
     *  Class - lookupIndex(), showModalIndex()
     * Description:
     *  Populates the fields with empty values from the lookupIndex() or response values from the showModalIndex()
     *  
     * @param result 
     * @param id 
     * @param description 
     */
    private patchFields(result: any, id: any, description: any) {
        this.form.patchValue({ [id]: result ? result.id : '' })
        this.form.patchValue({ [description]: result ? result.description : '' })
    }

    /**
     * Caller:
     *  Class - ngOnInit()
     * Description:
     *  Populates the dropdowns
     */
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

    /**
     * Caller:
     *  Class - getTransfer()
     * Description:
     *  Populates the form with record values
     * 
     * @param result 
     */
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

    /**
     * Caller:
     *  Class - constructor()
     * Description:
     *  Populates the form with initial values
     */
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

    /**
     * Caller:
     *  Class - ngOnInit()
     * Description:
     *  Hides the list and shows the form
     */
    private scrollToForm() {
        document.getElementById('transfersList').style.height = '0'
    }

    /**
     * Caller(s):
     *  Class - canDeactivate()
     * 
     * Description:
     *  Hides the form, shows the list and focuses on the table
     */
    private scrollToList(state: string) {
        document.getElementById('form').style.height = '0'
        document.getElementById('transfersList').style.height = '100%'
        document.getElementById('table-transfer-input').focus()
        console.log(state)
    }

    /**
     * Caller(s):
     *  Class - lookupIndex()
     * 
     * Description:
     *  Displays a modal window with a table so a record can be selected
     * 
     * @param elements 
     * @param title 
     * @param formFields 
     * @param fields 
     * @param headers 
     * @param widths    
     * @param visibility 
     * @param justify 
     */
    private showModalIndex(elements: any, title: string, formFields: any[], fields: any[], headers: any[], widths: any[], visibility: any[], justify: any[]) {
        const dialog = this.dialog.open(DialogIndexComponent, {
            height: '685px',
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
     * Caller(s):
     *  Class - ngOnInit()
     * 
     * Description:
     *  Accepts data from the wrapper through the interaction service and decides which action to perform
     */
    private subscribeToInderactionService() {
        this.interactionTransferService.action.subscribe(response => {
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
