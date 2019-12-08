import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material'
import { Router } from '@angular/router'
import { forkJoin } from 'rxjs'
import { IRoute } from '../models/route'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'
import { RouteService } from '../services/route.service'
import { Utils } from '../shared/classes/utils'
import { DialogIndexComponent } from '../shared/components/dialog-index/dialog-index.component'

@Component({
    selector: 'pickupPoint-list',
    templateUrl: './pickupPoint-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class PickupPointListComponent implements OnInit, OnDestroy {

    id: number

    routes: IRoute[] = []

    unlisten: Unlisten

    form = this.formBuilder.group({
        routeId: 0,
        routeDescription: ['', [Validators.required, Validators.maxLength(100)]],
    })

    constructor(private routeService: RouteService, private keyboardShortcutsService: KeyboardShortcuts, private router: Router, public dialog: MatDialog, private formBuilder: FormBuilder) {
        this.unlisten = null
    }

    ngOnInit() {
        this.addShortcuts()
        this.populateDropDowns()
        this.focus('routeDescription')
    }

    ngOnDestroy(): void {
        (this.unlisten) && this.unlisten();
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

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            "Enter": (event: KeyboardEvent): void => {
                this.populatePickupPoints()
            },
            "Alt.N": (event: KeyboardEvent): void => {
                event.preventDefault()
                document.getElementById('new').click()
            }
        }, {
            priority: 1,
            inputs: true
        })
    }

    private focus(field: string) {
        Utils.setFocus(field)
    }

    private patchFields(result: any[], id: any, description: any) {
        this.form.patchValue({ [id]: result ? result[0] : '' })
        this.form.patchValue({ [description]: result ? result[1] : '' })
    }

    private populateDropDowns() {
        let sources = []
        sources.push(this.routeService.getRoutes())
        return forkJoin(sources).subscribe(
            result => {
                this.routes = result[0]
            },
            error => {
                if (error.status == 404) {
                    this.router.navigate(['/error'])
                }
            }
        )
    }

    private populatePickupPoints() {
        this.router.navigate(['/pickupPoints/routeId/' + this.form.get('routeId').value])
    }

    private showModalIndex(filteredArray: any[], modalTitle: string, lookupId: any, lookupDescription: any) {
        let dialogRef = this.dialog.open(DialogIndexComponent, {
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

    // #endregion

}