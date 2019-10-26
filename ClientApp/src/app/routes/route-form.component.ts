import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { BsModalRef, BsModalService } from 'ngx-bootstrap'
import { forkJoin, Observable, Subject } from 'rxjs'
import { HelperService } from '../services/helper.service'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'
import { PortService } from '../services/port.service'
import { RouteService } from '../services/route.service'
import { Utils } from '../shared/classes/utils'
import { ModalDialogComponent } from '../shared/components/modal-dialog/modal-dialog.component'

@Component({
    selector: 'app-route-form',
    templateUrl: './route-form.component.html',
    styleUrls: ['../shared/styles/forms.css']
})

export class RouteFormComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Init

    id: number = null
    url: string = '/routes'

    ports: any

    modalRef: BsModalRef
    unlisten: Unlisten

    // #endregion     

    form = this.formBuilder.group({
        id: 0,
        abbreviation: ['', [Validators.maxLength(10)]],
        description: ['', [Validators.required, Validators.maxLength(100)]],
        portId: [''],
        portDescription: [''],
        userName: [this.helperService.getUsernameFromLocalStorage()]
    })

    constructor(private routeService: RouteService, private portService: PortService, private helperService: HelperService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private modalService: BsModalService, private keyboardShortcutsService: KeyboardShortcuts) {
        route.params.subscribe(p => (this.id = p['id']))
        this.unlisten = null
    }

    ngOnInit() {
        this.addShortcuts()
        this.populateDropDowns()
    }

    ngAfterViewInit(): void {
        document.getElementById("abbreviation").focus()
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
                    this.routeService.deleteRoute(this.id).subscribe(() => this.router.navigate([this.url]), error => {
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
            this.routeService.addRoute(this.form.value).subscribe(() => {
                this.form.reset();
                this.router.navigate([this.url])
            }, error => Utils.errorLogger(error))
        }
        if (this.id) {
            this.routeService.updateRoute(this.id, this.form.value).subscribe(() => {
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
            this.routeService.getRoute(this.id).subscribe(
                result => {
                    this.form.setValue({
                        id: result.id,
                        abbreviation: result.abbreviation,
                        description: result.description,
                        portId: result.port.id,
                        portDescription: result.port.description,
                        userName: result.userName
                    })
                },
                error => {
                    Utils.errorLogger(error)
                })
        }
    }

    private populateDropDowns() {
        let sources = []
        sources.push(this.portService.getPorts())
        if (this.id) {
            sources.push(this.routeService.getRoute(this.id))
        }
        return forkJoin(sources).subscribe(
            result => {
                this.ports = result[0]
                if (this.id) {
                    this.populateFields()
                }
            },
            error => {
                if (error.status == 404) {
                    this.router.navigate(['/error'])
                }
            }
        )
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

    getRequiredFieldMessage() {
        return 'This field is required, silly!'
    }

    getMaxLengthFieldMessage() {
        return 'This field must not be longer than '
    }

    // #endregion

    // #region Update dropdowns with values - called from the template

    updatePortId(lookupArray: any[], e: { target: { value: any } }): void {
        let name = e.target.value
        let list = lookupArray.filter(x => x.description === name)[0]

        this.form.patchValue({ portId: list ? list.id : '' })
    }

    // #endregion 

}
