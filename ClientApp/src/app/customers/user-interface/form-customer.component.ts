import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogAlertComponent } from 'src/app/shared/components/dialog-alert/dialog-alert.component';
import { DialogIndexComponent } from 'src/app/shared/components/dialog-index/dialog-index.component';
import { CustomerService } from '../../services/customer.service';
import { HelperService } from '../../services/helper.service';
import { KeyboardShortcuts, Unlisten } from '../../services/keyboard-shortcuts.service';
import { TaxOfficeService } from '../../services/taxOffice.service';
import { VatStateService } from '../../services/vatState.service';
import { Utils } from '../../shared/classes/utils';

@Component({
    selector: 'form-customer',
    templateUrl: './form-customer.component.html',
    styleUrls: ['../../shared/styles/forms.css']
})

export class CustomerFormComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Variables

    id: number
    url: string = '/customers'

    taxOffices: any
    vatStates: any

    unlisten: Unlisten

    ngUnsubscribe = new Subject<void>();

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

    // #endregion

    constructor(private customerService: CustomerService, private taxOfficeService: TaxOfficeService, private vatStateService: VatStateService, private helperService: HelperService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, public dialog: MatDialog, private keyboardShortcutsService: KeyboardShortcuts) {
        this.activatedRoute.params.subscribe(p => (this.id = p['id']))
        this.unlisten = null
    }

    ngOnInit() {
        this.addShortcuts()
        this.populateDropDowns()
    }

    ngAfterViewInit(): void {
        this.focus('description')
    }

    ngOnDestroy(): void {
        (this.unlisten) && this.unlisten()
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

    // T
    deleteRecord() {
        if (this.id != undefined) {
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
            dialogRef.afterClosed().subscribe(result => {
                if (result == 'true') {
                    this.customerService.deleteCustomer(this.id).subscribe(() => this.router.navigate([this.url]), error => {
                        Utils.errorLogger(error)
                        this.openErrorModal()
                    })
                }
            })
        }
    }

    // T
    goBack() {
        this.router.navigate(['../'], { relativeTo: this.activatedRoute })
    }

    // T
    lookupIndex(lookupArray: any[], title: string, formFields: any[], fields: any[], headers: any[], widths: any[], visibility: any[], justify: any[], value: { target: { value: any } }) {
        const filteredArray = []
        lookupArray.filter(x => {
            if (x.description.toUpperCase().includes(value.target.value.toUpperCase())) {
                filteredArray.push(x)
            }
        })
        if (filteredArray.length > 0) {
            this.showModalIndex(filteredArray, title, formFields, fields, headers, widths, visibility, justify)
        }
        if (filteredArray.length == 0) {
            this.patchFields(null, formFields[0], formFields[1])
            this.focus(formFields[1])
        }

    }

    // T
    saveRecord() {
        if (!this.form.valid) return
        if (!this.id) {
            this.customerService.addCustomer(this.form.value).subscribe(() => {
                this.form.reset()
                this.router.navigate([this.url])
            }, error => Utils.errorLogger(error))
        }
        if (this.id) {
            this.customerService.updateCustomer(this.id, this.form.value).subscribe(() => {
                this.form.reset()
                this.router.navigate([this.url])
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
                if (document.getElementsByClassName('cdk-overlay-pane').length == 0) {
                    event.preventDefault()
                    this.saveRecord()
                }
            },
            "Alt.C": (event: KeyboardEvent): void => {
                event.preventDefault()
                if (document.getElementsByClassName('cdk-overlay-pane').length != 0) {
                    document.getElementById('cancel').click()
                }
            },
            "Alt.O": (event: KeyboardEvent): void => {
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

    private patchFields(result: any, id: any, description: any) {
        this.form.patchValue({ [id]: result ? result.id : '' })
        this.form.patchValue({ [description]: result ? result.description : '' })
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

    private showModalIndex(
        elements: any,
        title: string,
        formFields: any[],
        fields: any[],
        headers: any[],
        widths: any[],
        visibility: any[],
        justify: any[]) {
        const dialog = this.dialog.open(DialogIndexComponent, {
            height: '640px',
            width: '600px',
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
            this.patchFields(result, formFields[0], formFields[1])
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