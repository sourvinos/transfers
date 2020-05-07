import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { User } from 'src/app/account/classes/user'
import { Utils } from 'src/app/shared/classes/utils'
import { ButtonClickService } from 'src/app/shared/services/button-click.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
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

    headers = ['S', 'Id', 'Display name', 'Username', 'Email']
    widths = ['40px', '0px', '40%', '30%', '']
    visibility = ['none', 'none', '', '', '', '']
    justify = ['center', 'center', 'left', 'left', 'left']
    fields = ['', 'id', 'displayname', 'username', 'email']

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    constructor(private activatedRoute: ActivatedRoute, private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private interactionService: InteractionService, private buttonClickService: ButtonClickService) {
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
            'Alt.F': (event: KeyboardEvent): void => {
                this.focus(event, 'searchField')
            },
            'Alt.N': (event: KeyboardEvent): void => {
                this.buttonClickService.clickOnButton(event, 'new')
            }
        }, {
            priority: 0,
            inputs: true
        })
    }

    private editRecord(id: number) {
        this.router.navigate([this.url, id])
    }

    private focus(event: KeyboardEvent, element: string) {
        event.preventDefault()
        Utils.setFocus(element)
    }

    private loadRecords() {
        this.records = this.activatedRoute.snapshot.data[this.resolver]
        this.filteredRecords = this.records.sort((a, b) => (a.username > b.username) ? 1 : -1)
    }

    private onGoBack() {
        this.router.navigate(['/'])
    }

    private subscribeToInteractionService() {
        this.interactionService.record.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.editRecord(response['id'])
        })
    }

}
