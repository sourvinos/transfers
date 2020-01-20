import { IPickupPoint } from './../classes/model-pickupPoint';
import { Utils } from './../../shared/classes/utils';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { MatDialog, MatSnackBar } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
import { forkJoin, Subject } from 'rxjs'
import { map, takeUntil } from 'rxjs/operators'
import { Unlisten, KeyboardShortcuts } from 'src/app/services/keyboard-shortcuts.service'
import { RouteService } from 'src/app/services/route.service'
import { PickupPointService } from '../classes/service-api-pickupPoint'
import { HelperService } from 'src/app/services/helper.service'
import { DialogAlertComponent } from 'src/app/shared/components/dialog-alert/dialog-alert.component'
import { InteractionPickupPointService } from '../classes/service-interaction-pickupPoint';
import { DialogIndexComponent } from 'src/app/shared/components/dialog-index/dialog-index.component';

@Component({
    selector: 'form-pickupPoint',
    templateUrl: './form-pickupPoint.html',
    styleUrls: ['../../shared/styles/forms.css']
})

export class FormPickupPointComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Init

    id: number
    pickupPoint: IPickupPoint
    url: string = '/pickupPoints'

    routes: any[]
    routesFlat: any[]

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    form = this.formBuilder.group({
        id: 0,
        routeId: [0, Validators.required], routeDescription: ['', [Validators.required]],
        description: ['', [Validators.required, Validators.maxLength(100)]],
        exactPoint: ['', [Validators.maxLength(100)]],
        time: ['', [Validators.required, Validators.pattern("[0-9][0-9]:[0-9][0-9]")]],
        userName: [this.helperService.getUsernameFromLocalStorage()]
    })

    // #endregion  

    constructor(private routeService: RouteService, private pickupPointService: PickupPointService, private helperService: HelperService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private keyboardShortcutsService: KeyboardShortcuts, public dialog: MatDialog, private interactionPickupPointService: InteractionPickupPointService, private snackBar: MatSnackBar) {
        this.activatedRoute.params.subscribe(p => {
            this.id = p['pickupPointId']
            if (this.id) {
                this.getPickupPoint()
                this.setStatus('editRecord')
            } else {
                this.setStatus('newRecord')
            }
        })
    }

    ngOnInit() {
        this.addShortcuts()
        this.populateDropDowns()
        this.subscribeToInderactionService()
    }

    ngAfterViewInit(): void {
        this.focus('routeDescription')
    }

    ngOnDestroy(): void {
        (this.unlisten) && this.unlisten();
    }

    // Master
    canDeactivate() {
        if (this.form.dirty) {
            const dialogRef = this.dialog.open(DialogAlertComponent, {
                height: '250px',
                width: '550px',
                data: {
                    title: 'Please confirm',
                    message: 'If you continue, changes in this record will be lost.',
                    actions: ['cancel', 'ok']
                },
                panelClass: 'dialog'
            })
            return dialogRef.afterClosed().pipe(map(result => {
                if (result == 'true') {
                    return true
                }
            }))
        } else {
            return true
        }
    }

    /**
     * Caller(s):
     *  Class - subscribeToInderactionService()
     * 
     * Description:
     *  Deletes the current record
     */
    deleteRecord() {
        if (this.form.value.id != 0) {
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
            dialogRef.afterClosed().subscribe((result) => {
                if (result == 'true') {
                    this.pickupPointService.deletePickupPoint(957).subscribe()
                }
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
        // console.log(lookupArray, title, formFields, fields, headers, widths, visibility, justify, value)
        const filteredArray = []
        lookupArray.filter(x => {
            var key = fields[1]
            if (x[key].toUpperCase().includes(value.target.value.toUpperCase())) {
                filteredArray.push(x)
            }
        })
        if (filteredArray.length > 0) {
            this.showModalIndex(filteredArray, title, formFields, fields, headers, widths, visibility, justify)
        }
        if (filteredArray.length == 0) {
            this.clearFields(null, formFields[0], formFields[1])
            this.focus(formFields[1])
        }
    }

    // T
    saveRecord() {
        // console.log('form-save')
        if (!this.form.valid) return
        if (this.form.value.id == 0) {
            this.pickupPointService.addPickupPoint(this.form.value).subscribe(() => {
                this.showSnackbar('Record saved', 'info')
                this.resetForm()
                this.focus('routeDescription')
            }, error => Utils.errorLogger(error))
        }
        else {
            this.pickupPointService.updatePickupPoint(this.form.value.id, this.form.value).subscribe(() => {
                this.showSnackbar('Record updated', 'info')
                this.resetForm()
                this.goBack()
            }, error => Utils.errorLogger(error))
        }
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
     * Caller(s):
     *  Class - showModalIndex()
     * 
     * Description:
     *  Assigns the key-value pair from the selected item in the modal to the form fields
     *  
     * @param result 
     */
    private patchFields(result: any, fields: any[]) {
        // console.log('PatchFields', result, fields[0], fields[1])
        if (result)
            Object.entries(result).forEach(([key, value]) => {
                this.form.patchValue({ [key]: value })
            })
        else
            fields.forEach(field => {
                this.form.patchValue({ [field]: '' })
            })
    }

    private populateDropDowns() {
        let sources = []
        sources.push(this.routeService.getRoutes())
        return forkJoin(sources).subscribe(
            result => {
                this.routes = result[0]
                this.routesFlat = this.flattenRoutes()
            },
            error => {
                if (error.status == 404) {
                    this.router.navigate(['/error'])
                }
            }
        )
    }

    private populateFields(result: IPickupPoint) {
        this.form.setValue({
            id: result.id,
            routeId: result.route.id, routeDescription: result.route.description,
            description: result.description,
            exactPoint: result.exactPoint,
            time: result.time,
            userName: result.userName
        })
    }

    /**
     * Caller(s):
     *  Class - lookupIndex()
     * 
     * Description:
     *  Displays a modal window with a table so a record can be selected
     * 
     * @param records 
     * @param title 
     * @param formFields 
     * @param fields 
     * @param headers 
     * @param widths    
     * @param visibility 
     * @param justify 
     */
    private showModalIndex(records: any, title: string, formFields: any[], fields: any[], headers: any[], widths: any[], visibility: any[], justify: any[]) {
        // console.log('Form fields', formFields)
        // console.log('Fields', fields)
        const dialog = this.dialog.open(DialogIndexComponent, {
            height: '685px',
            data: {
                records: records,
                title: title,
                formFields: formFields,
                fields: fields,
                headers: headers,
                widths: widths,
                visibility: visibility,
                justify: justify
            }
        })
        dialog.afterClosed().subscribe((result) => {
            // console.log('will patching', result, formFields)
            this.patchFields(result, formFields)
        })
    }

    // #region Helper properties

    get routeId() {
        return this.form.get('routeId')
    }

    get routeDescription() {
        return this.form.get('routeDescription')
    }

    get description() {
        return this.form.get('description')
    }

    get exactPoint() {
        return this.form.get('exactPoint')
    }

    get time() {
        return this.form.get('time')
    }

    // #endregion 

    /**
     * Caller(s):
     *  Class - constructor()
     * 
     * Description:
     *  Gets the selected record from the api
     */
    private getPickupPoint() {
        if (this.id) {
            this.pickupPointService.getPickupPoint(this.id).subscribe(result => {
                this.pickupPoint = result
                this.populateFields(this.pickupPoint)
            }, error => {
                // console.log('Error getting record')
            })
        }
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
        this.interactionPickupPointService.setRecordStatus(status)
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
 *  Class - saveRecord()
 * 
 * Description:
 *  Resets the form with default values
 */
    private resetForm() {
        this.form.reset({
            id: 0,
            routeId: 0, routeDescription: '',
            description: '',
            exactPoint: '',
            userName: ''
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
        this.interactionPickupPointService.action.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            if (response == 'saveRecord') this.saveRecord()
            if (response == 'deleteRecord') this.deleteRecord()
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

    private flattenRoutes(): any[] {
        // console.log('Flat', this.routes)
        this.routesFlat = []
        for (var {
            id: a,
            description: b,
        } of this.routes) {
            this.routesFlat.push({ routeId: a, routeDescription: b })
        }
        // console.log('Flat', this.routesFlat)
        return this.routesFlat
    }

}
