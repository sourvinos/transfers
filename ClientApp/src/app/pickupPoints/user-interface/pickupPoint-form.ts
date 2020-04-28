import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { ButtonClickService } from 'src/app/shared/services/button-click.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Utils } from '../../shared/classes/utils';
import { DialogService } from '../../shared/services/dialog.service';
import { PickupPoint } from '../classes/pickupPoint';
import { PickupPointService } from '../classes/pickupPoint.service';
import { MatDialog } from '@angular/material';
import { DialogIndexComponent } from 'src/app/shared/components/dialog-index/dialog-index.component';
import { RouteService } from 'src/app/routes/classes/route.service';

@Component({
    selector: 'pickuppoint-form',
    templateUrl: './pickupPoint-form.html',
    styleUrls: ['../../shared/styles/forms.css']
})

export class PickupPointFormComponent implements OnInit, AfterViewInit, OnDestroy {

    url = '/pickupPoints'
    form: FormGroup
    routes: any[]
    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    constructor(private pickupPointService: PickupPointService, private routeService: RouteService, private helperService: HelperService, private dialogService: DialogService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private keyboardShortcutsService: KeyboardShortcuts, private snackbarService: SnackbarService, private messageService: MessageService, private buttonClickService: ButtonClickService, public dialog: MatDialog) {
        this.activatedRoute.params.subscribe(p => {
            if (p.id) { this.getRecord(p.id) }
        })
    }

    ngOnInit() {
        this.initForm()
        this.addShortcuts()
        this.populateDropDowns()
    }

    ngAfterViewInit() {
        this.focus('routeAbbreviation')
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
                    this.onGoBack()
                    return true
                }
            })
        } else {
            return true
        }
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
        if (this.form.value.id === 0) {
            this.pickupPointService.add(this.form.value).subscribe(() => {
                this.showSnackbar(this.messageService.showAddedRecord(), 'info')
                this.resetForm()
                this.onGoBack()
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
            'Escape': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.buttonClickService.clickOnButton(event, 'goBack')
                }
            },
            'Alt.D': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'delete')
            },
            'Alt.S': (event: KeyboardEvent) => {
                this.buttonClickService.clickOnButton(event, 'save')
            },
            'Alt.C': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length !== 0) {
                    this.buttonClickService.clickOnButton(event, 'cancel')
                }
            },
            'Alt.O': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length !== 0) {
                    this.buttonClickService.clickOnButton(event, 'ok')
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
            routeId: ['', Validators.required], routeAbbreviation: ['', Validators.required],
            description: ['', [Validators.required, Validators.maxLength(100)]],
            exactPoint: ['', [Validators.required, Validators.maxLength(100)]],
            time: ['', [Validators.required, Validators.pattern('[0-9][0-9]:[0-9][0-9]')]],
            userName: this.helperService.getUsernameFromLocalStorage()
        })
    }

    private onGoBack() {
        this.router.navigate([this.url])
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
        sources.push(this.routeService.getAll())
        return forkJoin(sources).subscribe(
            result => {
                this.routes = result[0]
            })
    }

    private populateFields(result: PickupPoint) {
        this.form.setValue({
            id: result.id,
            routeId: result.route.id, routeAbbreviation: result.route.abbreviation,
            description: result.description,
            exactPoint: result.exactPoint,
            time: result.time,
            userName: result.userName
        })
    }

    private resetForm() {
        this.form.reset()
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

    private showSnackbar(message: string, type: string) {
        this.snackbarService.open(message, type)
    }

    // #region Getters

    get routeId() {
        return this.form.get('routeId')
    }

    get routeAbbreviation() {
        return this.form.get('routeAbbreviation')
    }

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
