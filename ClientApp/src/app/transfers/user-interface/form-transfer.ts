import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomerService } from 'src/app/customers/classes/customer.service';
import { DestinationService } from 'src/app/destinations/classes/destination.service';
import { Driver } from 'src/app/drivers/classes/driver';
import { DriverService } from 'src/app/drivers/classes/driver.service';
import { PickupPointService } from 'src/app/pickupPoints/classes/pickupPoint.service';
import { PortService } from 'src/app/ports/classes/port.service';
import { Utils } from 'src/app/shared/classes/utils';
import { DialogIndexComponent } from 'src/app/shared/components/dialog-index/dialog-index.component';
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service';
import { Transfer } from '../classes/transfer';
import { TransferService } from '../classes/transfer.service';

@Component({
    selector: 'form-transfer',
    templateUrl: './form-transfer.html',
    styleUrls: ['./form-transfer.css']
})

export class FormTransferComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Variables

    id: number
    transfer: Transfer
    url = '/transfers'

    destinations: any[]
    customers: any[]
    pickupPoints: any[]
    pickupPointsFlat: any[]
    drivers: any[]
    ports: any[]

    defaultDriver: Driver

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    form = this.formBuilder.group({
        id: 0,
        dateIn: '',
        destinationId: [0, Validators.required], destinationDescription: ['', Validators.required],
        customerId: [0, Validators.required], customerDescription: ['', Validators.required],
        pickupPointId: ['', Validators.required], pickupPointDescription: ['', Validators.required],
        driverId: [0, Validators.required], driverDescription: [{ value: '', disabled: true }, Validators.required],
        portId: [0, Validators.required], portDescription: [{ value: '', disabled: true }, Validators.required],
        adults: [0, Validators.required],
        kids: [0, Validators.required],
        free: [0, Validators.required],
        totalPersons: [{ value: 0, disabled: true }],
        remarks: ['', Validators.maxLength(100)],
        userName: ''
    })

    // #endregion

    constructor(private destinationService: DestinationService, private customerService: CustomerService, private pickupPointService: PickupPointService, private driverService: DriverService, private portService: PortService, private activatedRoute: ActivatedRoute, private router: Router, private transferService: TransferService, private formBuilder: FormBuilder, public dialog: MatDialog, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private interactionService: BaseInteractionService, private snackBar: MatSnackBar, private dialogService: DialogService) {
        this.activatedRoute.params.subscribe(p => {
            this.id = p['transferId']
            if (this.id) {
                this.getRecord()
                this.setStatus('editRecord')
            } else {
                this.driverService.getDefaultDriver()
                    .then(response => {
                        this.defaultDriver = response
                        this.populateFormWithDefaultData(this.defaultDriver)
                        this.setStatus('newRecord')
                    })
            }
        })
    }

    ngOnInit() {
        this.scrollToForm()
        this.addShortcuts()
        this.populateDropDowns()
        this.subscribeToInteractionService()
    }

    ngAfterViewInit() {
        this.focus('destinationDescription')
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
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
            this.dialogService.open('Warning', '#FE9F36', 'If you continue, changes in this record will be lost.').subscribe(response => {
                if (response) {
                    this.resetForm()
                    this.scrollToList()
                    this.goBack()
                    return true
                }
            })
        } else {
            this.scrollToList()
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
        const totalPersons = parseInt(this.form.value.adults, 10) + parseInt(this.form.value.kids, 10) + parseInt(this.form.value.free, 10)
        this.form.patchValue({ totalPersons: !!Number(totalPersons) ? totalPersons : 0 })
    }

    /**
     * Caller(s):
     *  Class - subscribeTointeractionService()
     *
     * Description:
     *  Deletes the current record
     */
    deleteRecord() {
        this.dialogService.open('Warning', '#FE9F36', 'If you continue, this record will be permanently deleted.').subscribe(response => {
            if (response) {
                this.transferService.delete(this.form.value.id).subscribe(() => {
                    this.showSnackbar('Record deleted', 'info')
                    this.goBack()
                })
            }
        })
    }

    /**
     * Caller(s):
     *  Template - lookupIndex()
     *
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
            const key = fields[1]
            if (x[key].toUpperCase().includes(value.target.value.toUpperCase())) {
                filteredArray.push(x)
            }
        })
        if (filteredArray.length > 0) {
            this.showModalIndex(filteredArray, title, fields, headers, widths, visibility, justify)
        }
        if (filteredArray.length === 0) {
            this.clearFields(null, formFields[0], formFields[1])
            this.focus(formFields[1])
        }
    }

    /**
     * Caller(s):
     *  Class - subscribeTointeractionService()
     *
     * Description:
     *  Adds or updates an existing record
     */
    saveRecord() {
        if (!this.form.valid) { return }
        if (this.form.value.id === 0) {
            this.transferService.add(this.form.value).subscribe(() => {
                this.showSnackbar('Record saved', 'info')
                this.resetForm()
                this.populateFormWithDefaultData(this.defaultDriver)
                this.focus('destinationDescription')
                this.refreshSummaries()
            })
        } else {
            this.transferService.update(this.form.value.id, this.form.value).subscribe(() => {
                this.showSnackbar('Record updated', 'info')
                this.resetForm()
                this.goBack()
            })
        }
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
     *
     * Description:
     *  Adds keyboard shortcuts
     */
    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': (event: KeyboardEvent): void => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.goBack()
                }
            },
            'Alt.D': (event: KeyboardEvent): void => {
                event.preventDefault()
                this.deleteRecord()
            },
            'Alt.S': (event: KeyboardEvent): void => {
                this.saveRecord()
            },
            'Alt.C': (event: KeyboardEvent): void => {
                if (document.getElementsByClassName('cdk-overlay-pane').length !== 0) {
                    document.getElementById('cancel').click()
                }
            },
            'Alt.O': (event: KeyboardEvent): void => {
                if (document.getElementsByClassName('cdk-overlay-pane').length !== 0) {
                    document.getElementById('ok').click()
                }
            }
        }, {
            priority: 2,
            inputs: true
        })
    }

    /**
     * Caller(s):
     *  Class - lookupIndex(), showModalIndex()
     *
     * Description:
     *  Populates the form fields with empty values from the lookupIndex() or response values from the showModalIndex()
     *
     * @param result
     * @param id
     * @param description
     */
    private clearFields(result: any, id: any, description: any) {
        this.form.patchValue({ [id]: result ? result.id : '' })
        this.form.patchValue({ [description]: result ? result.description : '' })
    }

    /**
     * Caller(s):
     *  Class - populateDropDowns()
     *
     * Description:
     *  Creates a new object used in the template
     */
    private flattenPickupPoints(): any[] {
        this.pickupPointsFlat = []
        for (const {
            id: a,
            description: b,
            exactPoint: c,
            time: d,
            route: { port: { id: e, description: f } }
        } of this.pickupPoints) {
            this.pickupPointsFlat.push({ pickupPointId: a, pickupPointDescription: b, exactPoint: c, time: d, portId: e, portDescription: f })
        }
        return this.pickupPointsFlat
    }

    /**
     * Caller(s):
     *  Class - ngAfterViewInit()

     * Description:
     *  Calls the public method()
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
    private getRecord() {
        if (this.id) {
            this.transferService.getSingle(this.id).then(response => {
                this.transfer = response
                this.populateFields(this.transfer)
            })
        }
    }

    /**
     * Caller(s):
     *  Class - canDeactive(), deleteRecord(), saveRecord()
     *
     * Description:
     *  Send 'empty' to the 'setRecordStatus', so that the wrapper will display the 'new' button
     *  On escape navigates to the list
     */
    private goBack() {
        this.setStatus('empty')
        this.router.navigate(['../../'], { relativeTo: this.activatedRoute })
    }

    /**
     * Caller(s):
     *  Class - showModalIndex()
     *
     * Description:
     *  Assigns the key-value pair from the selected item in the modal to the form fields
     *
     * @param result
     */
    private patchFields(result: any, fields: any[]) {
        if (result) {
            Object.entries(result).forEach(([key, value]) => {
                this.form.patchValue({ [key]: value })
            })
        } else {
            fields.forEach(field => {
                this.form.patchValue({ [field]: '' })
            })
        }
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
     *
     * Description:
     *  Populates the dropdowns
     */
    private populateDropDowns() {
        const sources = []
        sources.push(this.destinationService.getAll())
        sources.push(this.customerService.getAll())
        sources.push(this.pickupPointService.getAll())
        sources.push(this.driverService.getAll())
        sources.push(this.portService.getAll())
        return forkJoin(sources).subscribe(
            result => {
                this.destinations = result[0]
                this.customers = result[1]
                this.pickupPoints = result[2]
                this.pickupPointsFlat = this.flattenPickupPoints()
                this.drivers = result[3]
                this.ports = result[4]
                this.renameObjects()
            })
    }

    /**
     * Caller(s):
     *  Class - getTransfer()
     *
     * Description:
     *  Populates the form with record values
     *
     * @param result
     */
    private populateFields(result: Transfer) {
        this.form.setValue({
            id: result.id,
            dateIn: result.dateIn,
            destinationId: result.destination.id, destinationDescription: result.destination.description,
            customerId: result.customer.id, customerDescription: result.customer.description,
            pickupPointId: result.pickupPoint.id, pickupPointDescription: result.pickupPoint.description,
            portId: result.pickupPoint.route.port.id, portDescription: result.pickupPoint.route.port.description,
            driverId: result.driver.id, driverDescription: result.driver.description,
            adults: result.adults,
            kids: result.kids,
            free: result.free,
            totalPersons: result.totalPersons,
            remarks: result.remarks,
            userName: result.userName
        })
    }

    /**
     * Caller(s):
     *  Class - constructor()
     *
     * Description:
     *  Populates the form with initial values
     */
    private populateFormWithDefaultData(driver: Driver) {
        this.form.patchValue({
            dateIn: this.helperService.getDateFromLocalStorage(),
            driverId: driver.id,
            driverDescription: driver.description,
            userName: this.helperService.getUsernameFromLocalStorage()
        })
    }

    /**
     * Caller(s):
     *  Class - saveRecord()
     *
     * Description:
     *  Tells the list to refresh the summaries
     */
    private refreshSummaries() {
        this.interactionService.mustRefreshList()
    }

    /**
     * Caller(s):
     *  Class - renameObjects()
     *
     * Description:
     *  Renames the selected in memory object
     *
     * @param obj
     * @param oldKey
     * @param newKey
     */
    private renameKey(obj: Object, oldKey: string, newKey: string) {
        if (oldKey !== newKey) {
            Object.defineProperty(obj, newKey, Object.getOwnPropertyDescriptor(obj, oldKey))
            delete obj[oldKey]
        }
    }

    /**
     * Caller(s):
     *  Class - populateDropDowns()
     *
     * Description:
     *  Renames the objects in memory for use in the template
     */
    private renameObjects() {
        this.destinations.forEach(obj => {
            this.renameKey(obj, 'id', 'destinationId'); this.renameKey(obj, 'description', 'destinationDescription')
        })
        this.customers.forEach(obj => {
            this.renameKey(obj, 'id', 'customerId'); this.renameKey(obj, 'description', 'customerDescription')
        })
        this.drivers.forEach(obj => {
            this.renameKey(obj, 'id', 'driverId'); this.renameKey(obj, 'description', 'driverDescription')
        })
        this.ports.forEach(obj => {
            this.renameKey(obj, 'id', 'portId'); this.renameKey(obj, 'description', 'portDescription')
        })
    }

    /**
     * Caller(s):
     *  Class - saveRecord()
     *
     * Description:
     *  Resets the form with default values
     */
    private resetForm() {
        this.form.reset({
            id: 0,
            dateIn: '',
            destinationId: this.form.value.destinationId, destinationDescription: this.form.value.destinationDescription,
            customerId: 0, customerDescription: '',
            pickupPointId: 0, pickupPointDescription: '',
            driverId: 0, driverDescription: '',
            portId: 0, portDescription: '',
            adults: '0',
            kids: '0',
            free: '0',
            totalPersons: '0',
            remarks: '',
            userName: ''
        })
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
     *
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
    private scrollToList() {
        document.getElementById('form').style.height = '0'
        document.getElementById('transfersList').style.height = '100%'
        document.getElementById('table-transfer-input').focus()
        this.interactionService.performAction('')
    }

    /**
     * Caller(s):
     *  Class - constructor()
     *  Class - goBack()
     *
     * Desciption:
     *  Tells the wrapper which buttons to display
     *
     * @param status
     */
    private setStatus(status: string) {
        this.interactionService.setRecordStatus(status)
    }

    /**
     * Caller(s):
     *  Class - saveRecord()
     *
     * Description:
     *  Self-explanatory
     */
    private showSnackbar(message: string, type: string): void {
        this.snackBar.open(message, 'Close', {
            panelClass: [type]
        })
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
    private showModalIndex(elements: any, title: string, fields: any[], headers: any[], widths: any[], visibility: any[], justify: any[]) {
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
            this.patchFields(result, fields)
        })
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
     *
     * Description:
     *  Accepts data from the wrapper through the interaction service and decides which action to perform
     */
    private subscribeToInteractionService() {
        this.interactionService.action.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            if (response === 'saveRecord') { this.saveRecord() }
            if (response === 'deleteRecord') { this.deleteRecord() }
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
