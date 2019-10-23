import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { BsModalRef, BsModalService } from 'ngx-bootstrap'
import { Observable, Subject } from 'rxjs'
import { DriverService } from '../services/driver.service'
import { HelperService } from '../services/helper.service'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'
import { Utils } from '../shared/classes/utils'
import { ModalDialogComponent } from '../shared/components/modal-dialog/modal-dialog.component'

@Component({
    selector: 'app-driver-form',
    templateUrl: './driver-form.component.html',
    styleUrls: ['../shared/styles/forms.css']
})

export class DriverFormComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Init

    id: number
    url: string = '/drivers'

    modalRef: BsModalRef
    unlisten: Unlisten

    //#endregion

    form = this.formBuilder.group({
        id: 0,
        description: ['', [Validators.required, Validators.maxLength(100)]],
        userName: [this.helperService.getUsernameFromLocalStorage()]
    })

    constructor(private driverService: DriverService, private helperService: HelperService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private modalService: BsModalService, private keyboardShortcutsService: KeyboardShortcuts) {
        route.params.subscribe(p => (this.id = p['id']))
        this.unlisten = null
    }

    ngOnInit() {
        this.addShortcuts()
        this.populateFields()
    }

    ngAfterViewInit(): void {
        document.getElementById("description").focus()
    }

    ngOnDestroy(): void {
        (this.unlisten) && this.unlisten();
    }

    // Master
    canDeactivate(): Observable<boolean> | boolean {
        if (this.form.dirty) {
            const subject = new Subject<boolean>()
            const modal = this.modalService.show(ModalDialogComponent, {
                initialState: {
                    title: 'Confirmation',
                    message: 'If you continue, all changes in this record will be lost.',
                    type: 'question'
                }, animated: true
            })
            modal.content.subject = subject
            return subject.asObservable()
        }
        return true
    }

    // T
    deleteRecord() {
        if (this.id != undefined) {
            const subject = new Subject<boolean>()
            const modal = this.modalService.show(ModalDialogComponent, {
                initialState: {
                    title: 'Confirmation',
                    message: 'If you continue, this record will be deleted.',
                    type: 'delete'
                }, animated: true
            })
            modal.content.subject = subject
            return subject.asObservable().subscribe(result => {
                if (result)
                    this.driverService.deleteDriver(this.id).subscribe(() => this.router.navigate([this.url]), error => {
                        Utils.errorLogger(error)
                        this.openErrorModal()
                    })
            })
        }
    }

    // T
    goBack() {
        this.router.navigate([this.url])
    }

    // T 
    isValidInput(description: FormControl, id?: { invalid: any }, lookupArray?: any[]) {
        if (id == null) return (description.invalid && description.touched)
        if (id != null) return (id.invalid && description.invalid && description.touched) || (description.touched && !this.arrayLookup(lookupArray, description))
    }

    // T
    saveRecord() {
        if (!this.form.valid) return
        if (!this.id) {
            this.driverService.addDriver(this.form.value).subscribe(() => {
                this.form.reset();
                this.router.navigate([this.url])
            }, error => Utils.errorLogger(error))
        }
        if (this.id) {
            this.driverService.updateDriver(this.id, this.form.value).subscribe(() => {
                this.form.reset();
                this.router.navigate([this.url])
            }, error => Utils.errorLogger(error))
        }
    }

    private arrayLookup(lookupArray: any[], givenField: FormControl) {
        for (let x of lookupArray) {
            if (x.description.toLowerCase() == givenField.value.toLowerCase()) {
                return true
            }
        }
    }

    private openErrorModal() {
        const subject = new Subject<boolean>()
        const modal = this.modalService.show(ModalDialogComponent, {
            initialState: {
                title: 'Error',
                message: 'This record is in use and cannot be deleted.',
                type: 'error'
            }, animated: true
        })
        modal.content.subject = subject
        return subject.asObservable()
    }

    private populateFields() {
        if (this.id) {
            this.driverService.getDriver(this.id).subscribe(
                result => {
                    this.form.setValue({
                        id: result.id,
                        description: result.description,
                        userName: result.userName
                    })
                },
                error => {
                    Utils.errorLogger(error)
                })
        }
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            "Escape": (event: KeyboardEvent): void => {
                if (!document.getElementsByClassName('modal-dialog')[0]) {
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
                if (document.getElementsByClassName('modal-dialog')[0]) {
                    document.getElementById('cancel').click()
                }
            },
            "Alt.O": (event: KeyboardEvent): void => {
                if (document.getElementsByClassName('modal-dialog')[0]) {
                    document.getElementById('ok').click()
                }
            }
        }, {
            priority: 2,
            inputs: true
        })
    }

    // #region Helper properties

    get description() {
        return this.form.get('description')
    }

    // #endregion 

}
