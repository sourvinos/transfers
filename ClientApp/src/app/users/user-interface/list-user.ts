import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service'
import { KeyboardShortcuts, Unlisten } from '../../shared/services/keyboard-shortcuts.service'
import { Utils } from '../../shared/classes/utils'
import { User } from '../classes/model-user'

@Component({
    selector: 'list-user',
    templateUrl: './list-user.html',
    styleUrls: ['../../shared/styles/lists.css']
})

export class UserListComponent implements OnInit, OnDestroy {

    // #region Init

    records: User[]
    filteredRecords: User[]

    headers = ['Id', 'Display name', 'Username', 'Email']
    widths = ['0px', '40%', '30%', '30%']
    visibility = ['none', '', '', '', '']
    justify = ['center', 'left', 'left', 'left']
    fields = ['id', 'displayName', 'userName', 'email']

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    // #endregion

    constructor(private activatedRoute: ActivatedRoute, private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private baseInteractionService: BaseInteractionService) {
        this.loadRecords()
    }

    ngOnInit() {
        this.addShortcuts()
        this.focus('searchField')
        this.subscribeToInteractionService()
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten && this.unlisten()
    }

    /**
      * Caller(s):
      *  Class - subscribeTointeractionService()
      * 
      * Description:
      *  Self-explanatory
      * 
      * @param id 
      */
    editRecord(id: number) {
        this.navigateToEditRoute(id)
    }

    /**
     * Caller(s):
     *  Template - searchField
     * 
     * Description:
     *  Filters and returns the array to the template according to the input
     * 
     * @param query 
     */
    filter(query: string) {
        this.filteredRecords = query ? this.records.filter(p => p.userName.toLowerCase().includes(query.toLowerCase())) : this.records
    }

    /**
     * Caller(s):
     *  Template - newRecord()
     * 
     * Description:
     *  Navigates to the form so that new records can be appended
     */
    newRecord() {
        this.router.navigate(['/users/new'])
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
     * 
     * Description:
     *  Adds keyboard functionality
     */
    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            "Escape": (event: KeyboardEvent): void => {
                if (document.getElementsByClassName('cdk-overlay-pane').length == 0) {
                    this.goBack()
                }
            },
            "Alt.F": (event: KeyboardEvent): void => {
                event.preventDefault()
                this.focus('searchField')
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

    /**
     * Caller(s):
     *  Class - addShortcuts()
     * 
     * Description:
     *  On escape navigates to the home route
     */
    private goBack(): void {
        this.router.navigate(['/'])
    }

    /**
     * Caller(s):
     *  Class - constructor
     * 
     * Description:
     *  Self-explanatory
     */
    private loadRecords() {
        this.records = this.activatedRoute.snapshot.data['userList']
        this.filteredRecords = this.records
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
     * 
     * Description:
     *  Self-explanatory 
     * 
     * @param element 
     */
    private focus(element: string) {
        Utils.setFocus(element)
    }

    /**
     * Caller(s): 
     *  Class - ngOnInit()
     * 
     * Description:
     *  Gets the selected record from the table through the service and executes the editRecord method
     */
    private subscribeToInteractionService() {
        this.baseInteractionService.record.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.editRecord(response['id'])
        })
    }

    /**
     * Caller(s):
     *  Class - editRecord()
     * 
     * Description:
     *  Self-explanatory
     * 
     * @param id 
     */
    private navigateToEditRoute(id: number) {
        this.router.navigate(['/users', id])
    }

}
