import { MessageService } from 'src/app/shared/services/message.service';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { MatDialog, MatSnackBar } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
import { forkJoin, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PortService } from 'src/app/ports/classes/port.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { HelperService } from 'src/app/shared/services/helper.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { Utils } from 'src/app/shared/classes/utils'
import { DialogIndexComponent } from 'src/app/shared/components/dialog-index/dialog-index.component'
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service'
import { Route } from '../classes/route'
import { RouteService } from '../classes/route.service'

@Component({
    selector: 'route-form',
    templateUrl: './route-form.html',
    styleUrls: ['../../shared/styles/forms.css']
})

export class RouteFormComponent implements OnInit, AfterViewInit, OnDestroy {

    id: number
    url = '/routes'
    ports: any[]
    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()
    form = this.formBuilder.group({
        id: 0,
        abbreviation: ['', [Validators.required, Validators.maxLength(10)]],
        description: ['', [Validators.required, Validators.maxLength(100)]],
        portId: ['', Validators.required], portDescription: ['', Validators.required],
        userName: ''
    })

    constructor(private routeService: RouteService, private portService: PortService, private helperService: HelperService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, public dialog: MatDialog, private keyboardShortcutsService: KeyboardShortcuts, private interactionService: BaseInteractionService, private snackBar: MatSnackBar, private dialogService: DialogService, private messageService: MessageService) {
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
        this.populateDropDowns()
        this.subscribeToInteractionService()
    }

    ngAfterViewInit() {
        this.focus('abbreviation')
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
                this.routeService.delete(this.form.value.id).subscribe(() => {
                    this.showSnackbar(this.messageService.showDeletedRecord(), 'info')
                    this.goBack()
                })
            }
        })
    }

    lookupIndex(lookupArray: any[], title: string, formFields: any[], fields: any[], headers: any[], widths: any[], visibility: any[], justify: any[], value: { target: { value: any } }) {
        const filteredArray = []
        lookupArray.filter(x => {
            const key = fields[1]
            if (x[key].toUpperCase().includes(value.target.value.toUpperCase())) {
                filteredArray.push(x)
            }
        })
        if (filteredArray.length > 0) {
            this.showModalIndex(filteredArray, title, fields, headers, widths, visibility, justify)
        }
        if (filteredArray.length === 0) {
            this.clearFields(null, formFields[0], formFields[1])
            this.focus(formFields[1])
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
                this.saveRecord()
            },
            'Alt.C': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length !== 0) {
                    document.getElementById('cancel').click()
                }
            },
            'Alt.O': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length !== 0) {
                    document.getElementById('ok').click()
                }
            }
        }, {
            priority: 2,
            inputs: true
        })
    }

    private clearFields(result: any, id: any, description: any) {
        this.form.patchValue({ [id]: result ? result.id : '' })
        this.form.patchValue({ [description]: result ? result.description : '' })
    }

    private focus(field: string) {
        Utils.setFocus(field)
    }

    private goBack() {
        this.router.navigate([this.url])
    }

    private populateFields(result: Route) {
        this.form.setValue({
            id: result.id,
            abbreviation: result.abbreviation,
            description: result.description,
            portId: result.port.id, portDescription: result.port.description,
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
            abbreviation: '',
            desciption: '',
            routeId: 0, routeDescription: '',
            userName: ''
        })
    }

    private showSnackbar(message: string, type: string): void {
        this.snackBar.open(message, 'Close', {
            panelClass: [type]
        })
    }

    saveRecord() {
        if (!this.form.valid) { return }
        if (this.form.value.id === 0) {
            this.routeService.add(this.form.value).subscribe(() => {
                this.showSnackbar(this.messageService.showAddedRecord(), 'info')
                this.resetForm()
                this.goBack()
            })
        } else {
            this.routeService.update(this.form.value.id, this.form.value).subscribe(() => {
                this.showSnackbar(this.messageService.showUpdatedRecord(), 'info')
                this.resetForm()
                this.goBack()
            })
        }
    }

    private getRecord() {
        if (this.id) {
            this.routeService.getSingle(this.id).then(result => {
                this.populateFields(result)
            })
        }
    }

    private patchFields(result: any, fields: any[]) {
        if (result) {
            Object.entries(result).forEach(([key, value]) => {
                this.form.patchValue({ [key]: value })
            })
        } else {
            fields.forEach(field => {
                this.form.patchValue({ [field]: '' })
            })
        }
    }

    private populateDropDowns() {
        const sources = []
        sources.push(this.portService.getAll())
        return forkJoin(sources).subscribe(
            result => {
                this.ports = result[0]
                this.renameObjects()
            }
        )
    }

    private renameKey(obj: Object, oldKey: string, newKey: string) {
        if (oldKey !== newKey) {
            Object.defineProperty(obj, newKey, Object.getOwnPropertyDescriptor(obj, oldKey))
            delete obj[oldKey]
        }
    }

    private renameObjects() {
        this.ports.forEach(obj => {
            this.renameKey(obj, 'id', 'portId'); this.renameKey(obj, 'description', 'portDescription')
        })
    }

    private showModalIndex(elements: any, title: string, fields: any[], headers: any[], widths: any[], visibility: any[], justify: any[]) {
        const dialog = this.dialog.open(DialogIndexComponent, {
            height: '685px',
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
            this.patchFields(result, fields)
        })
    }

    private subscribeToInteractionService() {
        this.interactionService.action.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            if (response === 'saveRecord') { this.saveRecord() }
            if (response === 'deleteRecord') { this.deleteRecord() }
        })
    }

    // #region Helper properties

    get abbreviation() {
        return this.form.get('abbreviation')
    }

    get description() {
        return this.form.get('description')
    }

    get portId() {
        return this.form.get('portId')
    }

    get portDescription() {
        return this.form.get('portDescription')
    }

    // #endregion

}
