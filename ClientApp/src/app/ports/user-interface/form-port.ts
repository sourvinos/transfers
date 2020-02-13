import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { Utils } from 'src/app/shared/classes/utils'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { Port } from '../classes/model-port'
import { PortService } from '../classes/service-api-port'

@Component({
    selector: 'form-port',
    templateUrl: './form-port.html',
    styleUrls: ['../../shared/styles/forms.css']
})

export class PortFormComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Init

    id: number
    port: Port
    url: string = '/ports'

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    form = this.formBuilder.group({
        id: 0,
        description: ['', [Validators.required, Validators.maxLength(100)]],
        userName: ''
    })

    // #endregion     

    constructor(private portService: PortService, private helperService: HelperService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, public dialog: MatDialog, private keyboardShortcutsService: KeyboardShortcuts, private dialogService: DialogService, private snackbarService: SnackbarService) {
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
     *  Template - deleteRecord()
     * 
     * Description:
     *  Deletes the current record
     */
    deleteRecord() {
        this.dialogService.open('Warning', '#FE9F36', 'If you continue, this record will be permanently deleted.').subscribe(response => {
            if (response) {
                this.portService.delete(this.form.value.id).subscribe(() => {
                    this.showSnackbar('Record deleted', 'info')
                    this.resetForm()
                    this.goBack()
                })
            }
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
            this.portService.add(this.form.value).subscribe(() => {
                this.showSnackbar('Record saved', 'info')
                this.resetForm()
                this.goBack()
            })
        }
        else {
            this.portService.update(this.form.value.id, this.form.value).subscribe(() => {
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
                if (document.getElementsByClassName('cdk-overlay-pane').length == 0) {
                    event.preventDefault()
                    this.saveRecord()
                }
            },
            "Alt.C": (event: KeyboardEvent) => {
                event.preventDefault()
                if (document.getElementsByClassName('cdk-overlay-pane').length != 0) {
                    document.getElementById('cancel').click()
                }
            },
            "Alt.O": (event: KeyboardEvent) => {
                event.preventDefault()
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
    private getRecord() {
        if (this.id) {
            this.portService.getSingle(this.id).then(result => {
                this.port = result
                this.populateFields()
            })
        }
    }

    /**
     * Caller(s): 
     *  Class - canDeactive(), deleteRecord(), saveRecord()
     * 
     * Description:
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
    private populateFields() {
        if (this.id) {
            this.portService.getSingle(this.id).then(
                result => {
                    this.form.setValue({
                        id: result.id,
                        description: result.description,
                        userName: result.userName
                    })
                })
        }
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
            description: '',
            userName: ''
        })
    }

    /**
     * Caller(s):
     *  Class - saveRecord() - deleteRecord()
     * 
     * Description:
     *  Self-explanatory
     */
    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    // #region Helper properties

    get description() {
        return this.form.get('description')
    }

    // #endregion 

}
