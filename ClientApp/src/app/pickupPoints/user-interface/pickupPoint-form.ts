import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Utils } from '../../shared/classes/utils';
import { DialogService } from '../../shared/services/dialog.service';
import { PickupPoint } from '../classes/pickupPoint';
import { PickupPointService } from '../classes/pickupPoint.service';

@Component({
    selector: 'pickuppoint-form',
    templateUrl: './pickupPoint-form.html',
    styleUrls: ['../../shared/styles/forms.css']
    // styleUrls: ['./pickupPoint-form.css']
})

export class PickupPointFormComponent implements OnInit, AfterViewInit, OnDestroy {

    url = '/pickupPoints'
    form: FormGroup
    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    constructor(private pickupPointService: PickupPointService, private helperService: HelperService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private keyboardShortcutsService: KeyboardShortcuts, private interactionService: BaseInteractionService, private snackbarService: SnackbarService, private dialogService: DialogService, private messageService: MessageService) {
        this.activatedRoute.params.subscribe(p => {
            if (p.pickupPointId) {
                this.getRecord(p.pickupPointId)
                this.setStatus('editRecord')
            } else {
                this.form.patchValue({ routeId: this.router.url.split('/')[3] })
                this.setStatus('newRecord')
            }
        })
    }

    ngOnInit() {
        this.initForm()
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
        this.unlisten()
    }

    canDeactivate() {
        if (this.form.dirty) {
            this.dialogService.open('Warning', '#FE9F36', this.messageService.askConfirmationToAbortEditing(), ['cancel', 'ok']).subscribe(response => {
                if (response) {
                    this.resetForm()
                    this.scrollToList()
                    this.onGoBack()
                    return true
                }
            })
        } else {
            this.scrollToList()
            return true
        }
    }

    onDelete() {
        this.dialogService.open('Warning', '#FE9F36', this.messageService.askConfirmationToDelete(), ['cancel', 'ok']).subscribe(response => {
            if (response) {
                this.pickupPointService.delete(this.form.value.id).subscribe(() => {
                    this.showSnackbar(this.messageService.showDeletedRecord(), 'info')
                    this.resetForm()
                    this.onGoBack()
                }, () => {
                    this.showSnackbar(this.messageService.recordIsInUse(), 'error')
                })
            }
        })
    }

    onSave() {
        if (!this.form.valid) { return }
        if (this.form.value.id === 0) {
            this.pickupPointService.add(this.form.value).subscribe(() => {
                this.showSnackbar(this.messageService.showAddedRecord(), 'info')
                this.resetForm()
                this.focus('description')
            })
        } else {
            this.pickupPointService.update(this.form.value.id, this.form.value).subscribe(() => {
                this.showSnackbar(this.messageService.showUpdatedRecord(), 'info')
                this.resetForm()
                this.onGoBack()
            })
        }
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': (): void => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.onGoBack()
                }
            },
            'Alt.D': (event: KeyboardEvent): void => {
                event.preventDefault()
                this.onDelete()
            },
            'Alt.S': (event: KeyboardEvent): void => {
                this.onSave()
            },
            'Alt.C': (event: KeyboardEvent): void => {
                if (document.getElementsByClassName('cdk-overlay-pane').length !== 0) {
                    document.getElementById('cancel').click()
                }
            },
            'Alt.O': (event: KeyboardEvent): void => {
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

    private getRecord(id: string | number) {
        this.pickupPointService.getSingle(id).then(result => {
            this.populateFields(result)
        }, () => {
            this.showSnackbar(this.messageService.showNotFoundRecord(), 'error')
            this.onGoBack()
        })
    }

    private initForm() {
        this.form = this.formBuilder.group({
            id: 0,
            routeId: [0, Validators.required],
            description: ['', [Validators.required, Validators.maxLength(100)]],
            exactPoint: ['', [Validators.required, Validators.maxLength(100)]],
            time: ['', [Validators.required, Validators.pattern('[0-9][0-9]:[0-9][0-9]')]],
            userName: this.helperService.getUsernameFromLocalStorage()
        })
    }

    private onGoBack() {
        this.setStatus('empty')
        this.router.navigate(['../../'], { relativeTo: this.activatedRoute })
    }

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

    private resetForm() {
        this.form.reset({
            id: 0,
            routeId: 0,
            description: '',
            exactPoint: '',
            userName: ''
        })
    }

    private scrollToForm() {
        document.getElementById('pickupPointsList').style.height = '0'
    }

    private scrollToList() {
        document.getElementById('content').style.height = '0'
        document.getElementById('pickupPointsList').style.height = '100%'
        this.interactionService.performAction('')
    }

    private setStatus(status: string) {
        this.interactionService.setRecordStatus(status)
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    private subscribeTointeractionService() {
        this.interactionService.action.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            if (response === 'saveRecord') { this.onSave() }
            if (response === 'deleteRecord') { this.onDelete() }
        })
    }

    // #region Getters

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
