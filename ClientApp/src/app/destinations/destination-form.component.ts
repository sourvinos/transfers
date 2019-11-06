import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
import { map } from 'rxjs/operators'
import { DestinationService } from '../services/destination.service'
import { HelperService } from '../services/helper.service'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'
import { Utils } from '../shared/classes/utils'
import { MaterialDialogComponent } from '../shared/components/material-dialog/material-dialog.component'

@Component({
    selector: 'app-destination-form',
    templateUrl: './destination-form.component.html',
    styleUrls: ['../shared/styles/forms.css']
})

export class DestinationFormComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Init

    id: number
    url: string = '/destinations'

    unlisten: Unlisten

    // #endregion     

    form = this.formBuilder.group({
        id: 0,
        abbreviation: ['', [Validators.maxLength(5)]],
        description: ['', [Validators.required, Validators.maxLength(100)]],
        userName: [this.helperService.getUsernameFromLocalStorage()]
    })

    constructor(
        private destinationService: DestinationService,
        private helperService: HelperService,
        private formBuilder: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        private keyboardShortcutsService: KeyboardShortcuts) {
        this.activatedRoute.params.subscribe(p => (this.id = p['id']))
        this.unlisten = null
    }

    ngOnInit() {
        this.addShortcuts()
        this.populateFields()
    }

    ngAfterViewInit(): void {
        this.focus('abbreviation')
    }

    ngOnDestroy(): void {
        (this.unlisten) && this.unlisten();
    }

    // Master
    canDeactivate() {
        if (this.form.dirty) {
            const dialogRef = this.dialog.open(MaterialDialogComponent, {
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
            const dialogRef = this.dialog.open(MaterialDialogComponent, {
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
                    this.destinationService.deleteDestination(this.id).subscribe(() => this.router.navigate([this.url]), error => {
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
            this.destinationService.addDestination(this.form.value).subscribe(() => {
                this.form.reset();
                this.router.navigate([this.url])
            }, error => Utils.errorLogger(error))
        }
        if (this.id) {
            this.destinationService.updateDestination(this.id, this.form.value).subscribe(() => {
                this.form.reset();
                this.router.navigate([this.url])
            }, error => Utils.errorLogger(error))
        }
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

    private focus(field: string) {
        Utils.setFocus(field)
    }

    private openErrorModal() {
        this.dialog.open(MaterialDialogComponent, {
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
            this.destinationService.getDestination(this.id).subscribe(
                result => {
                    this.form.setValue({
                        id: result.id,
                        abbreviation: result.abbreviation,
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

    get abbreviation() {
        return this.form.get('abbreviation')
    }

    get description() {
        return this.form.get('description')
    }

    // #endregion 

}
