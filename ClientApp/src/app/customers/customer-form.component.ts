import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { forkJoin, Observable, Subject } from 'rxjs'
import { CustomerService } from '../services/customer.service'
import { HelperService } from '../services/helper.service'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'
import { TaxOfficeService } from '../services/taxOffice.service'
import { VatStateService } from '../services/vatState.service'
import { Utils } from '../shared/classes/utils'
import { ModalDialogComponent } from '../shared/components/modal-dialog/modal-dialog.component'
import { MatDialog, MatTableDataSource } from '@angular/material'
import { SelectionModel } from '@angular/cdk/collections'
import { MaterialDialogComponent } from '../shared/components/material-dialog/material-dialog.component'

interface TableItem {
    name: string;
}

@Component({
    selector: 'app-customer-form',
    templateUrl: './customer-form.component.html',
    styleUrls: ['../shared/styles/forms.css']
})

export class CustomerFormComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Init

    id: number
    url: string = '/customers'

    taxOffices: any
    vatStates: any

    modalRef: BsModalRef
    unlisten: Unlisten

    taxOfficeDataSource: MatTableDataSource<TableItem>; taxOfficeSelection: SelectionModel<TableItem>;

    // #endregion     

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

    constructor(private customerService: CustomerService, private taxOfficeService: TaxOfficeService, private vatStateService: VatStateService, private helperService: HelperService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, public dialog: MatDialog, private keyboardShortcutsService: KeyboardShortcuts, private modalService: BsModalService) {
        route.params.subscribe(p => (this.id = p['id']))
        this.unlisten = null
    }

    ngOnInit() {
        this.addShortcuts()
        this.populateDropDowns()
    }

    ngAfterViewInit(): void {
        Utils.setFocus('description')
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
                    this.customerService.deleteCustomer(this.id).subscribe(() => this.router.navigate([this.url]), error => {
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
    lookupIndex(lookupArray: any[], lookupId: any, lookupDescription: any, e: { target: { value: any } }) {
        const filteredArray = []
        lookupArray.filter(x => { if (x.description.toUpperCase().includes(e.target.value.toUpperCase())) filteredArray.push(x) })
        if (filteredArray.length > 0) {
            this.showModalIndex(filteredArray, lookupId, lookupDescription)
        }
        if (filteredArray.length == 0) {
            this.patchFields(null, lookupId, lookupDescription)
        }
    }

    // T
    saveRecord() {
        if (!this.form.valid) return
        if (!this.id) {
            this.customerService.addCustomer(this.form.value).subscribe(() => {
                this.form.reset();
                this.router.navigate([this.url])
            }, error => Utils.errorLogger(error))
        }
        if (this.id) {
            this.customerService.updateCustomer(this.id, this.form.value).subscribe(() => {
                this.form.reset();
                this.router.navigate([this.url])
            }, error => Utils.errorLogger(error))
        }
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            "Escape": (event: KeyboardEvent): void => {
                if (!document.getElementsByClassName('cdk-overlay-pane')) {
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

    private patchFields(result: any[], id: any, description: any) {
        this.form.patchValue({ [id]: result ? result[0] : '' })
        this.form.patchValue({ [description]: result ? result[1] : '' })
    }

    private populateFields() {
        if (this.id) {
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
                this.taxOfficeDataSource = new MatTableDataSource<TableItem>(result)[0];
                this.taxOfficeSelection = new SelectionModel<TableItem>(false);
                this.taxOffices = result[0]

                this.vatStates = result[1]
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

    private showModalIndex(filteredArray: any[], lookupId: any, lookupDescription: any) {
        let selection = this.dialog.open(MaterialDialogComponent, {
            data: {
                headers: ['id', 'description'],
                records: filteredArray
            }
        })
        selection.afterClosed().subscribe((result) => {
            this.patchFields(result, lookupId, lookupDescription)
        })
    }

    // #region Helper properties

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

    // #endregion

}