import { CountdownService } from './../services/countdown.service';
import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core'
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { forkJoin, Observable, Subject } from 'rxjs'
import { CustomerService } from '../services/customer.service'
import { HelperService } from '../services/helper.service'
import { TaxOfficeService } from '../services/taxOffice.service'
import { VatStateService } from '../services/vatState.service'
import { Utils } from '../shared/classes/utils'
import { ModalDialogComponent } from '../shared/components/modal-dialog/modal-dialog.component'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'

@Component({
    selector: 'app-customer-form',
    templateUrl: './customer-form.component.html',
    styleUrls: ['../shared/styles/forms.css']
})

export class CustomerFormComponent implements OnInit, AfterViewInit, OnDestroy {

    taxOffices: any
    vatStates: any

    id: number
    isNewRecord: boolean

    modalRef: BsModalRef
    unlisten: Unlisten

    form = this.formBuilder.group({
        id: 0,
        description: ['', [Validators.required, Validators.maxLength(100)]],
        profession: ['', [Validators.maxLength(100)]],
        taxOfficeId: ['', Validators.required],
        taxOfficeDescription: ['', Validators.required],
        vatStateId: ['', Validators.required],
        vatStateDescription: ['', Validators.required],
        address: ['', [Validators.maxLength(100)]],
        phones: ['', [Validators.maxLength(100)]],
        personInCharge: ['', [Validators.maxLength(100)]],
        email: ['', [Validators.maxLength(100)]],
        taxNo: ['', [Validators.maxLength(100)]],
        accountCode: ['', [Validators.maxLength(100)]],
        userName: [this.helperService.getUsernameFromLocalStorage()]
    })

    constructor(private customerService: CustomerService, private taxOfficeService: TaxOfficeService, private vatStateService: VatStateService, private helperService: HelperService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private modalService: BsModalService, private keyboardShortcutsService: KeyboardShortcuts) {
        route.params.subscribe(p => (this.id = p['id']))
        this.unlisten = null
    }

    ngOnInit() {
        this.addShortcuts()
        this.populateDropDowns()
    }

    ngAfterViewInit(): void {
        document.getElementById("description").focus()
    }

    public ngOnDestroy(): void {
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
        if (this.id !== null) {
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
                    this.customerService.deleteCustomer(this.id).subscribe(() => this.router.navigate(['/customers']), error => {
                        Utils.errorLogger(error)
                        this.openErrorModal()
                    })
            })
        }
    }

    // T
    goBack() {
        this.router.navigate(['/customers'])
    }

    // T 
    isValidInput(description: FormControl, id?: { invalid: any }, lookupArray?: any[]) {
        if (id == null) return (description.invalid && description.touched)
        if (id != null) return (id.invalid && description.invalid && description.touched) || (description.touched && !this.arrayLookup(lookupArray, description))
    }

    // T
    saveRecord() {
        if (!this.form.valid) return
        if (this.isNewRecord) {
            this.customerService.addCustomer(this.form.value).subscribe(() => {
                this.form.reset();
                this.router.navigate(['/customers'])
            }, error => Utils.errorLogger(error))
        }
        if (!this.isNewRecord) {
            this.customerService.updateCustomer(this.id, this.form.value).subscribe(() => {
                this.form.reset();
                this.router.navigate(['/customers'])
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
        this.customerService.getCustomer(this.id).subscribe(
            result => {
                this.form.setValue({
                    id: result.id,
                    description: result.description,
                    profession: result.profession,
                    taxOfficeId: result.taxOffice.id,
                    taxOfficeDescription: result.taxOffice.description,
                    vatStateId: result.vatState.id,
                    vatStateDescription: result.vatState.description,
                    address: result.address,
                    phones: result.phones,
                    personInCharge: result.personInCharge,
                    email: result.email,
                    taxNo: result.taxNo,
                    accountCode: result.accountCode,
                    userName: result.userName
                })
            },
            error => {
                Utils.errorLogger(error)
            })
    }

    private populateDropDowns() {
        let sources = []
        sources.push(this.taxOfficeService.getTaxOffices())
        sources.push(this.vatStateService.getVatStates())
        if (this.id) {
            sources.push(this.customerService.getCustomer(this.id))
        }
        return forkJoin(sources).subscribe(
            result => {
                this.taxOffices = result[0]
                this.vatStates = result[1]
                if (this.id) {
                    this.isNewRecord = false
                    this.populateFields()
                } else {
                    this.isNewRecord = true
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
                    event.preventDefault()
                    document.getElementById('goBack').click()
                }
            },
            "Alt.D": (event: KeyboardEvent): void => {
                event.preventDefault()
                document.getElementById('delete').click()
            },
            "Alt.C": (event: KeyboardEvent): void => {
                if (document.getElementsByClassName('modal-dialog')[0]) {
                    event.preventDefault()
                    document.getElementById('cancel').click()
                }
            },
            "Alt.O": (event: KeyboardEvent): void => {
                if (document.getElementsByClassName('modal-dialog')[0]) {
                    event.preventDefault()
                    document.getElementById('ok').click()
                }
            },
            "Alt.S": (event: KeyboardEvent): void => {
                event.preventDefault()
                document.getElementById('save').click()
            },
        }, {
            priority: 2,
            inputs: true
        })
    }

    // #region Update dropdowns with values - called from the template

    get description() {
        return this.form.get('description')
    }

    get profession() {
        return this.form.get('profession')
    }

    get address() {
        return this.form.get('address')
    }

    get phones() {
        return this.form.get('phones')
    }

    get personInCharge() {
        return this.form.get('personInCharge')
    }

    get email() {
        return this.form.get('email')
    }

    get taxNo() {
        return this.form.get('taxNo')
    }

    get accountCode() {
        return this.form.get('accountCode')
    }

    get taxOfficeId() {
        return this.form.get('taxOfficeId')
    }

    get taxOfficeDescription() {
        return this.form.get('taxOfficeDescription')
    }

    get vatStateId() {
        return this.form.get('vatStateId')
    }

    get vatStateDescription() {
        return this.form.get('vatStateDescription')
    }

    //#endregion

    // #region Update dropdowns with values - called from the template

    updateTaxOfficeId(lookupArray: any[], e: { target: { value: any } }): void {
        let name = e.target.value
        let list = lookupArray.filter(x => x.description === name)[0]
        this.form.patchValue({ taxOfficeId: list ? list.id : '' })
    }

    updateVatStateId(lookupArray: any[], e: { target: { value: any } }): void {
        let name = e.target.value
        let list = lookupArray.filter(x => x.description === name)[0]
        this.form.patchValue({ vatStateId: list ? list.id : '' })
    }

    // #endregion Update dropdowns with values

}