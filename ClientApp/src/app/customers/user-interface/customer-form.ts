import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { Utils } from '../../shared/classes/utils'
import { HelperService } from '../../shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from '../../shared/services/keyboard-shortcuts.service'
import { CustomerService } from '../classes/customer.service'
import { MessageService } from 'src/app/shared/services/message.service'

@Component({
    selector: 'customer-form',
    templateUrl: './customer-form.html',
    styleUrls: ['../../shared/styles/forms.css']
})

export class CustomerFormComponent implements OnInit, AfterViewInit, OnDestroy {

    id: number
    url = '/customers'
    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    form = this.formBuilder.group({
        id: 0,
        description: ['', [Validators.required, Validators.maxLength(100)]],
        profession: ['', [Validators.maxLength(100)]],
        address: ['', [Validators.maxLength(100)]],
        phones: ['', [Validators.maxLength(100)]],
        personInCharge: ['', [Validators.maxLength(100)]],
        email: ['', [Validators.maxLength(100)]],
        userName: ''
    })

    // #endregion

    constructor(private customerService: CustomerService, private helperService: HelperService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, public dialog: MatDialog, private keyboardShortcutsService: KeyboardShortcuts, private dialogService: DialogService, private snackbarService: SnackbarService, private messageService: MessageService) {
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
        this.unlisten()
    }

    canDeactivate() {
        if (this.form.dirty) {
            this.dialogService.open('Warning', '#FE9F36', this.messageService.askConfirmationToAbortEditing(), ['cancel', 'ok']).subscribe(response => {
                if (response) {
                    this.resetForm()
                    this.goBack()
                    return true
                }
            })
        } else {
            return true
        }
    }

    deleteRecord() {
        this.dialogService.open('Warning', '#FE9F36', this.messageService.askConfirmationToDelete(), ['cancel', 'ok']).subscribe(response => {
            if (response) {
                this.customerService.delete(this.form.value.id).subscribe(() => {
                    this.showSnackbar(this.messageService.showDeletedRecord(), 'info')
                    this.resetForm()
                    this.goBack()
                })
            }
        })
    }

    saveRecord() {
        if (!this.form.valid) { return }
        if (this.form.value.id === 0) {
            this.customerService.add(this.form.value).subscribe(() => {
                this.showSnackbar(this.messageService.showAddedRecord(), 'info')
                this.resetForm()
                this.goBack()
            })
        } else {
            this.customerService.update(this.form.value.id, this.form.value).subscribe(() => {
                this.showSnackbar(this.messageService.showUpdatedRecord(), 'info')
                this.resetForm()
                this.goBack()
            })
        }
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.goBack()
                }
            },
            'Alt.D': (event: KeyboardEvent) => {
                event.preventDefault()
                this.deleteRecord()
            },
            'Alt.S': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    event.preventDefault()
                    this.saveRecord()
                }
            },
            'Alt.C': (event: KeyboardEvent) => {
                event.preventDefault()
                if (document.getElementsByClassName('cdk-overlay-pane').length !== 0) {
                    document.getElementById('cancel').click()
                }
            },
            'Alt.O': (event: KeyboardEvent) => {
                event.preventDefault()
                if (document.getElementsByClassName('cdk-overlay-pane').length !== 0) {
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

    private getRecord() {
        if (this.id) {
            this.customerService.getSingle(this.id).then(result => {
                this.populateFields(result)
            })
        }
    }

    private goBack() {
        this.router.navigate([this.url])
    }

    private populateFields(result: any) {
        this.form.setValue({
            id: result.id,
            description: result.description,
            profession: result.profession,
            address: result.address,
            phones: result.phones,
            personInCharge: result.personInCharge,
            email: result.email,
            userName: result.userName
        })
    }

    private populateFormWithDefaultData() {
        this.form.patchValue({
            userName: this.helperService.getUsernameFromLocalStorage()
        })
    }

    private resetForm() {
        this.form.reset({
            id: 0,
            description: '',
            profession: '',
            address: '',
            phones: '',
            personInCharge: '',
            email: '',
            userName: ''
        })
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
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

    // #endregion

}
