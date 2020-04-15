import { MessageService } from 'src/app/shared/services/message.service';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HelperService } from 'src/app/shared/services/helper.service';
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { PickupPointService } from '../classes/pickupPoint.service';
import { DialogService } from '../../shared/services/dialog.service';
import { Utils } from '../../shared/classes/utils';
import { PickupPoint } from '../classes/pickupPoint';
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service';

@Component({
    selector: 'pickuppoint-form',
    templateUrl: './pickupPoint-form.html',
    styleUrls: ['./pickupPoint-form.css']
})

export class PickupPointFormComponent implements OnInit, AfterViewInit, OnDestroy {

    id: number
    pickupPoint: PickupPoint
    url = '/pickupPoints'
    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()
    form = this.formBuilder.group({
        id: 0,
        routeId: [0, Validators.required],
        description: ['', [Validators.required, Validators.maxLength(100)]],
        exactPoint: ['', [Validators.required, Validators.maxLength(100)]],
        time: ['', [Validators.required, Validators.pattern('[0-9][0-9]:[0-9][0-9]')]],
        userName: ''
    })

    constructor(private pickupPointService: PickupPointService, private helperService: HelperService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private keyboardShortcutsService: KeyboardShortcuts, public dialog: MatDialog, private interactionService: BaseInteractionService, private snackbarService: SnackbarService, private dialogService: DialogService, private messageService: MessageService) {
        this.activatedRoute.params.subscribe(p => {
            this.id = p['pickupPointId']
            if (this.id) {
                this.getPickupPoint()
                this.setStatus('editRecord')
            } else {
                this.form.patchValue({ routeId: this.router.url.split('/')[3] })
                this.populateFormWithDefaultData()
                this.setStatus('newRecord')
            }
        })
    }

    ngOnInit() {
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
                    this.goBack()
                    return true
                }
            })
        } else {
            this.scrollToList()
            return true
        }
    }

    deleteRecord() {
        this.dialogService.open('Warning', '#FE9F36', this.messageService.askConfirmationToDelete(), ['cancel', 'ok']).subscribe(response => {
            if (response) {
                this.pickupPointService.delete(this.form.value.id).subscribe(() => {
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
            this.pickupPointService.add(this.form.value).subscribe(() => {
                this.showSnackbar(this.messageService.showAddedRecord(), 'info')
                this.resetForm()
                this.populateFormWithDefaultData()
                this.focus('description')
            })
        } else {
            this.pickupPointService.update(this.form.value.id, this.form.value).subscribe(() => {
                this.showSnackbar(this.messageService.showUpdatedRecord(), 'info')
                this.resetForm()
                this.goBack()
            })
        }
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': (): void => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.goBack()
                }
            },
            'Alt.D': (event: KeyboardEvent): void => {
                event.preventDefault()
                this.deleteRecord()
            },
            'Alt.S': (event: KeyboardEvent): void => {
                this.saveRecord()
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

    private getPickupPoint() {
        if (this.id) {
            this.pickupPointService.getSingle(this.id).then(result => {
                this.pickupPoint = result
                this.populateFields(this.pickupPoint)
            })
        }
    }

    private goBack() {
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

    private populateFormWithDefaultData() {
        this.form.patchValue({
            userName: this.helperService.getUsernameFromLocalStorage()
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
        document.getElementById('form').style.height = '0'
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
            if (response === 'saveRecord') { this.saveRecord() }
            if (response === 'deleteRecord') { this.deleteRecord() }
        })
    }

    // #region Helper properties

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
