import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Utils } from 'src/app/shared/classes/utils';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { DriverService } from '../classes/driver.service';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
    selector: 'driver-form',
    templateUrl: './driver-form.html',
    styleUrls: ['../../shared/styles/forms.css']
})

export class DriverFormComponent implements OnInit, AfterViewInit, OnDestroy {

    id: number
    url = '/drivers'
    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();
    form = this.formBuilder.group({
        id: 0,
        description: ['', [Validators.required, Validators.maxLength(100)]],
        phones: ['', [Validators.maxLength(100)]],
        userName: ''
    })

    constructor(private driverService: DriverService, private helperService: HelperService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, public dialog: MatDialog, private keyboardShortcutsService: KeyboardShortcuts, private dialogService: DialogService, private snackbarService: SnackbarService, private messageService: MessageService) {
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
                this.driverService.delete(this.form.value.id).subscribe(() => {
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
            this.driverService.add(this.form.value).subscribe(() => {
                this.showSnackbar(this.messageService.showAddedRecord(), 'info')
                this.resetForm()
                this.goBack()
            })
        } else {
            this.driverService.update(this.form.value.id, this.form.value).subscribe(() => {
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
            this.driverService.getSingle(this.id).then(result => {
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
            phones: result.phones,
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
            phones: '',
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

    get phones() {
        return this.form.get('phones')
    }

    // #endregion

}
