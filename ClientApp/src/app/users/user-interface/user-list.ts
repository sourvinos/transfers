import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { User } from '../../account/classes/user'
import { Utils } from '../../shared/classes/utils'
import { KeyboardShortcuts, Unlisten } from '../../shared/services/keyboard-shortcuts.service'

@Component({
    selector: 'user-list',
    templateUrl: './user-list.html',
    styleUrls: ['../../shared/styles/lists.css']
})

export class UserListComponent implements OnInit, OnDestroy {

    records: User[]
    filteredRecords: User[]
    url = '/users'
    resolver = 'userList'

    headers = ['Id', 'Display name', 'Username', 'Email']
    widths = ['0px', '40%', '30%', '30%']
    visibility = ['none', '', '', '', '']
    justify = ['center', 'left', 'left', 'left']
    fields = ['id', 'displayname', 'username', 'email']

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    constructor(private activatedRoute: ActivatedRoute, private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private baseInteractionService: BaseInteractionService, private buttonClickService: ButtonClickService) {
        this.loadRecords()
    }

    ngOnInit() {
        this.addShortcuts()
        this.subscribeToInteractionService()
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    editRecord(id: number) {
        this.router.navigate([this.url, id])
    }

    onFilter(query: string) {
        this.filteredRecords = query ? this.records.filter(p => p.username.toLowerCase().includes(query.toLowerCase())) : this.records
    }

    onNew() {
        this.router.navigate([this.url + '/new'])
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': (event: KeyboardEvent): void => {
                this.onGoBack()
            },
            'Control.F': (event: KeyboardEvent): void => {
                this.focus(event, 'searchField')
            },
            'Control.N': (event: KeyboardEvent): void => {
                this.buttonClickService.clickOnButton(event, 'new')
            }
        }, {
            priority: 0,
            inputs: true
        })
    }

    private focus(event: KeyboardEvent, element: string) {
        event.preventDefault()
        Utils.setFocus(element)
    }

    private onGoBack(): void {
        this.router.navigate(['/'])
    }

    private loadRecords() {
        this.records = this.activatedRoute.snapshot.data[this.resolver]
        this.filteredRecords = this.records
    }

    private subscribeToInteractionService() {
        this.baseInteractionService.record.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.editRecord(response['id'])
        })
    }

}
