import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HelperService } from 'src/app/shared/services/helper.service';
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { PickupPointService } from '../classes/service-api-pickupPoint';
import { DialogService } from '../../shared/services/dialog.service';
import { Utils } from './../../shared/classes/utils';
import { PickupPoint } from './../classes/model-pickupPoint';
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service';

@Component({
    selector: 'form-pickupPoint',
    templateUrl: './form-pickupPoint.html',
    styleUrls: ['./form-pickupPoint.css']
})

export class FormPickupPointComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Init

    id: number
    pickupPoint: PickupPoint
    url: string = '/pickupPoints'

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    form = this.formBuilder.group({
        id: 0,
        routeId: [0, Validators.required],
        description: ['', [Validators.required, Validators.maxLength(100)]],
        exactPoint: ['', [Validators.maxLength(100)]],
        time: ['', [Validators.required, Validators.pattern("[0-9][0-9]:[0-9][0-9]")]],
        userName: ''
    })

    // #endregion

    constructor(private pickupPointService: PickupPointService, private helperService: HelperService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private keyboardShortcutsService: KeyboardShortcuts, public dialog: MatDialog, private interactionService: BaseInteractionService, private snackbarService: SnackbarService, private dialogService: DialogService) {
        this.activatedRoute.params.subscribe(p => {
            this.id = p['pickupPointId']
            if (this.id) {
                this.getPickupPoint()
                this.setStatus('editRecord')
            } else {
                this.form.patchValue({ routeId: this.router.url.split("/")[3] })
                this.populateFormWithDefaultData()
                this.setStatus('newRecord')
            }
        })
    }

    ngOnInit() {
        this.scrollToForm()
        this.addShortcuts()
        this.subscribeTointeractionService()
    }

    ngAfterViewInit() {
        this.focus('description')
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
                    this.scrollToList()
                    this.goBack()
                    return true
                }
            })
        }
        else {
            this.scrollToList()
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
                this.pickupPointService.delete(this.form.value.id).subscribe(() => {
                    this.showSnackbar('Record deleted', 'info')
                    this.resetForm()
                    this.goBack()
                })
            }
        })
    }

    /**
     * Caller(s):
     *  Class - subscribeTointeractionService()
     * 
     * Description:
     *  Adds or updates an existing record
     */
    saveRecord() {
        if (!this.form.valid) return
        if (this.form.value.id == 0) {
            this.pickupPointService.add(this.form.value).subscribe(() => {
                this.showSnackbar('Record saved', 'info')
                this.resetForm()
                this.populateFormWithDefaultData()
                this.focus('description')
            })
        }
        else {
            this.pickupPointService.update(this.form.value.id, this.form.value).subscribe(() => {
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
    private getPickupPoint() {
        if (this.id) {
            this.pickupPointService.getSingle(this.id).then(result => {
                this.pickupPoint = result
                this.populateFields(this.pickupPoint)
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
     *  Class - getPickupPoint()
     * 
     * Description:
     *  Populates the form with record values
     * 
     * @param result 
     */
    private populateFields(result: PickupPoint) {
        this.form.setValue({
            id: result.id,
            routeId: result.route.id,
            description: result.description,
            exactPoint: result.exactPoint,
            time: result.time,
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
     *  Class - canDeactivate() - saveRecord()
     * 
     * Description:
     *  Resets the form with default values
     */
    private resetForm() {
        this.form.reset({
            id: 0,
            routeId: 0,
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
     *  Hides the list and shows the form
     */
    private scrollToForm() {
        document.getElementById('pickupPointsList').style.height = '0'
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
        document.getElementById('pickupPointsList').style.height = '100%'
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
        this.snackbarService.open(message, type)
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
     * 
     * Description:
     *  Accepts data from the wrapper through the interaction service and decides which action to perform
     */
    private subscribeTointeractionService() {
        this.interactionService.action.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            if (response == 'saveRecord') this.saveRecord()
            if (response == 'deleteRecord') this.deleteRecord()
        })
    }

    // #region Helper properties

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

}
