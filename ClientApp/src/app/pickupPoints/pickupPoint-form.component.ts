import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
import { forkJoin } from 'rxjs'
import { map } from 'rxjs/operators'
import { HelperService } from '../services/helper.service'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'
import { PickupPointService } from '../services/pickupPoint.service'
import { RouteService } from '../services/route.service'
import { Utils } from '../shared/classes/utils'
import { DialogAlertComponent } from '../shared/components/dialog-alert/dialog-alert.component'

@Component({
    selector: 'app-pickupPoint-form',
    templateUrl: './pickupPoint-form.component.html',
    styleUrls: ['../shared/styles/forms.css']
})

export class PickupPointFormComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Init

    id: number
    url: string = '/pickupPoints'

    routes: any

    unlisten: Unlisten

    // #endregion  

    form = this.formBuilder.group({
        id: 0,
        routeId: ['', Validators.required],
        routeDescription: ['', [Validators.required]],
        description: ['', [Validators.required, Validators.maxLength(100)]],
        exactPoint: ['', [Validators.maxLength(100)]],
        time: ['', [Validators.required, Validators.pattern("[0-9][0-9]:[0-9][0-9]")]],
        userName: [this.helperService.getUsernameFromLocalStorage()]
    })

    constructor(private routeService: RouteService, private pickupPointService: PickupPointService, private helperService: HelperService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private keyboardShortcutsService: KeyboardShortcuts, public dialog: MatDialog) {
        this.activatedRoute.params.subscribe(p => (this.id = p['id']))
        this.unlisten = null
    }

    ngOnInit() {
        this.addShortcuts()
        this.populateDropDowns()
    }

    ngAfterViewInit(): void {
        this.focus('routeDescription')
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
                    this.pickupPointService.deletePickupPoint(this.id).subscribe(() => this.router.navigate([this.url]), error => {
                        Utils.errorLogger(error)
                        this.openErrorModal()
                    })
                }
            })
        }
    }

    // T
    goBack() {
        this.router.navigateByUrl(this.url + '/29')
        // this.router.navigateByUrl(this.url, { state: { routeId: '29' } })
    }

    // T
    lookupIndex(lookupArray: any[], modalTitle: string, lookupId: any, lookupDescription: any, e: { target: { value: any } }) {
        const filteredArray = []
        lookupArray.filter(x => {
            if (x.description.toUpperCase().includes(e.target.value.toUpperCase())) {
                filteredArray.push(x)
            }
        })
        if (filteredArray.length > 0) {
            this.showModalIndex(filteredArray, modalTitle, lookupId, lookupDescription)
        }
        if (filteredArray.length == 0) {
            this.focus(lookupDescription)
            this.patchFields(null, lookupId, lookupDescription)
        }
    }

    // T
    saveRecord() {
        if (!this.form.valid) return
        if (!this.id) {
            this.pickupPointService.addPickupPoint(this.form.value).subscribe(() => {
                this.form.reset();
                this.router.navigate([this.url])
            }, error => Utils.errorLogger(error))
        }
        if (this.id) {
            this.pickupPointService.updatePickupPoint(this.id, this.form.value).subscribe(() => {
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

    private patchFields(result: any[], id: any, description: any) {
        this.form.patchValue({ [id]: result ? result[0] : '' })
        this.form.patchValue({ [description]: result ? result[1] : '' })
    }

    private populateDropDowns() {
        let sources = []
        sources.push(this.routeService.getRoutes())
        if (this.id) {
            sources.push(this.pickupPointService.getPickupPoint(this.id))
        }
        return forkJoin(sources).subscribe(
            result => {
                this.routes = result[0]
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
            this.pickupPointService.getPickupPoint(this.id).subscribe(
                result => {
                    this.form.setValue({
                        id: result.id,
                        routeId: result.route.id,
                        routeDescription: result.route.description,
                        description: result.description,
                        exactPoint: result.exactPoint,
                        time: result.time,
                        userName: result.userName
                    })
                },
                error => {
                    Utils.errorLogger(error)
                })
        }
    }

    private showModalIndex(filteredArray: any[], modalTitle: string, lookupId: any, lookupDescription: any) {
        let dialogRef = this.dialog.open(DialogAlertComponent, {
            data: {
                header: modalTitle,
                columns: ['id', 'description'],
                fields: ['Id', 'Description'],
                align: ['center', 'left'],
                format: ['', ''],
                records: filteredArray
            }
        })
        dialogRef.afterClosed().subscribe((result) => {
            this.patchFields(result, lookupId, lookupDescription)
        })
    }

    // #region Helper properties

    get routeId() {
        return this.form.get('routeId')
    }

    get routeDescription() {
        return this.form.get('routeDescription')
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
