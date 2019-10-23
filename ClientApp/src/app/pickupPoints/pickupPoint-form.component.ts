import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { BsModalRef, BsModalService } from 'ngx-bootstrap'
import { forkJoin, Observable, Subject } from 'rxjs'
import { HelperService } from '../services/helper.service'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'
import { PickupPointService } from '../services/pickupPoint.service'
import { RouteService } from '../services/route.service'
import { Utils } from '../shared/classes/utils'
import { ModalDialogComponent } from '../shared/components/modal-dialog/modal-dialog.component'

@Component({
    selector: 'pickupPoint-customer-form',
    templateUrl: './pickupPoint-form.component.html',
    styleUrls: ['../shared/styles/forms.css']
})

export class PickupPointFormComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Init

    id: number = null
    url: string = '/pickupPoints'

    routes: any

    modalRef: BsModalRef
    unlisten: Unlisten

    // #endregion  

    form = this.formBuilder.group({
        id: 0,
        routeId: ['', Validators.required],
        routeDescription: ['', [Validators.required]],
        description: ['', [Validators.required, Validators.maxLength(100)]],
        exactPoint: ['', [Validators.maxLength(100)]],
        time: ['', [Validators.required, Validators.pattern("[0-9][0-9]:[0-9][0-9]")]],
        userName: [this.helperService.getUsernameFromLocalStorage()]
    })

    constructor(private routeService: RouteService, private pickupPointService: PickupPointService, private helperService: HelperService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private modalService: BsModalService, private keyboardShortcutsService: KeyboardShortcuts) {
        route.params.subscribe(p => this.id = p['id'])
        this.unlisten = null
    }

    ngOnInit() {
        this.addShortcuts()
        this.populateDropDowns()
    }

    ngAfterViewInit(): void {
        document.getElementById("route").focus()
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
                    this.pickupPointService.deletePickupPoint(this.id).subscribe(() => this.router.navigate([this.url]), error => {
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
            this.pickupPointService.addPickupPoint(this.form.value).subscribe(() => {
                this.form.reset();
                this.router.navigate([this.url])
            }, error => Utils.errorLogger(error))
        }
        if (this.id) {
            this.pickupPointService.updatePickupPoint(this.id, this.form.value).subscribe(() => {
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
            this.pickupPointService.getPickupPoint(this.id).subscribe(
                result => {
                    this.form.setValue({
                        id: result.id,
                        routeId: result.route.id,
                        routeDescription: result.route.description,
                        description: result.description,
                        exactPoint: result.exactPoint,
                        time: result.time,
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
        sources.push(this.routeService.getRoutes())
        if (this.id) {
            sources.push(this.pickupPointService.getPickupPoint(this.id))
        }
        return forkJoin(sources).subscribe(
            result => {
                this.routes = result[0]
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

    // #region Update dropdowns with values - called from the template

    updateRouteId(lookupArray: any[], e: { target: { value: any } }): void {
        let name = e.target.value
        let list = lookupArray.filter(x => x.description === name)[0]
        this.form.patchValue({ routeId: list ? list.id : '' })
    }

    // #endregion

}
