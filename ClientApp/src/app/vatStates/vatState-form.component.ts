import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { HelperService } from '../services/helper.service';
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service';
import { VatStateService } from '../services/vatState.service';
import { Utils } from '../shared/classes/utils';
import { DialogAlertComponent } from '../shared/components/dialog-alert/dialog-alert.component';

@Component({
    selector: 'app-vatState-form',
    templateUrl: './vatState-form.component.html',
    styleUrls: ['../shared/styles/forms.css']
})

export class VatStateFormComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Init

    id: number = null
    url: string = '/vatStates'

    unlisten: Unlisten

    // #endregion     

    form = this.formBuilder.group({
        id: 0,
        description: ['', [Validators.required, Validators.maxLength(100)]],
        userName: [this.helperService.getUsernameFromLocalStorage()]
    })

    constructor(private vatStateService: VatStateService, private helperService: HelperService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private keyboardShortcutsService: KeyboardShortcuts, private activatedRoute: ActivatedRoute, public dialog: MatDialog) {
        this.activatedRoute.params.subscribe(p => (this.id = p['id']))
        this.unlisten = null
    }

    ngOnInit() {
        this.addShortcuts()
        this.populateFields()
    }

    ngAfterViewInit(): void {
        this.focus('description')
    }

    ngOnDestroy(): void {
        (this.unlisten) && this.unlisten();
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
                    this.vatStateService.deleteVatState(this.id).subscribe(() => this.router.navigate([this.url]), error => {
                        Utils.errorLogger(error)
                        this.openErrorModal()
                    })
                }
            })
        }
    }

    // T
    goBack() {
        this.router.navigate([this.url])
    }

    // T
    saveRecord() {
        if (!this.form.valid) return
        if (!this.id) {
            this.vatStateService.addVatState(this.form.value).subscribe(() => {
                this.form.reset();
                this.router.navigate([this.url])
            }, error => Utils.errorLogger(error))
        }
        if (this.id) {
            this.vatStateService.updateVatState(this.id, this.form.value).subscribe(() => {
                this.form.reset();
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
                this.saveRecord()
            },
            "Alt.C": (event: KeyboardEvent): void => {
                if (document.getElementsByClassName('cdk-overlay-pane').length != 0) {
                    document.getElementById('cancel').click()
                }
            },
            "Alt.O": (event: KeyboardEvent): void => {
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

    private populateFields() {
        if (this.id) {
            this.vatStateService.getVatState(this.id).subscribe(
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

    // #region Helper properties

    get description() {
        return this.form.get('description')
    }

    // #endregion 

}
