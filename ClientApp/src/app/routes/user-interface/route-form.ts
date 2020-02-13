import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { MatDialog, MatSnackBar } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
import { forkJoin, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PortService } from 'src/app/ports/classes/port.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { Utils } from 'src/app/shared/classes/utils'
import { DialogIndexComponent } from 'src/app/shared/components/dialog-index/dialog-index.component'
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service'
import { Route } from '../classes/route'
import { RouteService } from '../classes/route.service'

@Component({
    selector: 'route-form',
    templateUrl: './route-form.html',
    styleUrls: ['../../shared/styles/forms.css']
})

export class RouteFormComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Init

    id: number
    route: Route
    url: string = '/routes'

    ports: any[]

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    form = this.formBuilder.group({
        id: 0,
        abbreviation: ['', [Validators.required, Validators.maxLength(10)]],
        description: ['', [Validators.required, Validators.maxLength(100)]],
        portId: ['', Validators.required], portDescription: ['', Validators.required],
        userName: ''
    })

    // #endregion     

    constructor(private routeService: RouteService, private portService: PortService, private helperService: HelperService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, public dialog: MatDialog, private keyboardShortcutsService: KeyboardShortcuts, private interactionService: BaseInteractionService, private snackBar: MatSnackBar, private dialogService: DialogService) {
        this.activatedRoute.params.subscribe(p => {
            this.id = p['id']
            if (this.id) {
                this.getRecord()
            } else {
                this.populateFormWithDefaultData()
            }
        })
    }

    ngOnInit() {
        this.addShortcuts()
        this.populateDropDowns()
        this.subscribeToInteractionService()
    }

    ngAfterViewInit() {
        this.focus('abbreviation')
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
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
            this.dialogService.open('Warning', '#FE9F36', 'If you continue, changes in this record will be lost.').subscribe(response => {
                if (response) {
                    this.resetForm()
                    this.goBack()
                    return true
                }
            })
        }
        else {
            return true
        }
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
                this.routeService.delete(this.form.value.id).subscribe(() => {
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
            var key = fields[1]
            if (x[key].toUpperCase().includes(value.target.value.toUpperCase())) {
                filteredArray.push(x)
            }
        })
        if (filteredArray.length > 0) {
            this.showModalIndex(filteredArray, title, fields, headers, widths, visibility, justify)
        }
        if (filteredArray.length == 0) {
            this.clearFields(null, formFields[0], formFields[1])
            this.focus(formFields[1])
        }
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
     * 
     * Description:
     *  Self-explanatory
     */
    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            "Escape": () => {
                if (document.getElementsByClassName('cdk-overlay-pane').length == 0) {
                    this.goBack()
                }
            },
            "Alt.D": (event: KeyboardEvent) => {
                event.preventDefault()
                this.deleteRecord()
            },
            "Alt.S": (event: KeyboardEvent) => {
                this.saveRecord()
            },
            "Alt.C": (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length != 0) {
                    document.getElementById('cancel').click()
                }
            },
            "Alt.O": (event: KeyboardEvent) => {
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
     *  Class - canDeactive(), deleteRecord(), saveRecord()
     * 
     * Description:
     *  Send 'empty' to the 'setRecordStatus', so that the wrapper will display the 'new' button
     *  On escape navigates to the list
     */
    private goBack() {
        this.router.navigate([this.url])
    }

    /**
     * Caller(s):
     *  Class - getRecord()
     * 
     * Description:
     *  Populates the form with record values
     * 
     * @param result 
     */
    private populateFields(result: Route) {
        this.form.setValue({
            id: result.id,
            abbreviation: result.abbreviation,
            description: result.description,
            portId: result.port.id, portDescription: result.port.description,
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
    private populateFormWithDefaultData() {
        this.form.patchValue({
            userName: this.helperService.getUsernameFromLocalStorage()
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
            abbreviation: '',
            desciption: '',
            routeId: 0, routeDescription: '',
            userName: ''
        })
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
     *  Template - saveRecord()
     * 
     * Description:
     *  Adds or updates an existing record
     */
    saveRecord() {
        if (!this.form.valid) return
        if (this.form.value.id == 0) {
            this.routeService.add(this.form.value).subscribe(() => {
                this.showSnackbar('Record saved', 'info')
                this.resetForm()
                this.goBack()
            })
        }
        else {
            this.routeService.update(this.form.value.id, this.form.value).subscribe(() => {
                this.showSnackbar('Record updated', 'info')
                this.resetForm()
                this.goBack()
            })
        }
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
            this.routeService.getSingle(this.id).then(response => {
                this.route = response
                this.populateFields(this.route)
            })
        }
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
        }
        else
            fields.forEach(field => {
                this.form.patchValue({ [field]: '' })
            })
    }

    private populateDropDowns() {
        let sources = []
        sources.push(this.portService.getAll())
        return forkJoin(sources).subscribe(
            result => {
                this.ports = result[0]
                this.renameObjects()
            }
        )
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
        this.ports.forEach(obj => {
            this.renameKey(obj, 'id', 'portId'); this.renameKey(obj, 'description', 'portDescription')
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
            if (response == 'saveRecord') this.saveRecord()
            if (response == 'deleteRecord') this.deleteRecord()
        })
    }

    // #region Helper properties

    get abbreviation() {
        return this.form.get('abbreviation')
    }

    get description() {
        return this.form.get('description')
    }

    get portId() {
        return this.form.get('portId')
    }

    get portDescription() {
        return this.form.get('portDescription')
    }

    // #endregion

}
