import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { UserService } from 'src/app/users/classes/user.service';
import { KeyboardShortcuts, Unlisten } from '../../shared/services/keyboard-shortcuts.service';

@Component({
    selector: 'email-confirmed-form',
    templateUrl: './email-confirmed-form.html',
    styleUrls: ['../../shared/styles/forms.css', './email-confirmed-form.css']
})

export class EmailConfirmedComponent implements OnInit, OnDestroy {

    // #region Variables

    url: string
    userId: string
    token: string

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    // #endregion

    constructor(private http: HttpClient, private userService: UserService, private router: Router, private keyboardShortcutsService: KeyboardShortcuts, private snackbarService: SnackbarService, private activatedRoute: ActivatedRoute) {
        this.activatedRoute.params.subscribe(p => {
            this.userId = p.userId
            this.token = p.token
        })
    }

    ngOnInit() {
        this.addShortcuts()
        this.confirmEmail()
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    /**
     * Caller(s):
     *  Template - saveRecord()
     *
     * Description:
     *  Creates a token to reset the password
     */
    login() {
        this.router.navigate(['/'])
    }

    /**
     * Caller(s):
     *  Template - goBack()
     */
    goBack() {
        this.router.navigate([this.url])
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
     */
    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.goBack()
                }
            },
            'Alt.L': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    event.preventDefault()
                    // this.login()
                }
            }
        }, {
            priority: 2,
            inputs: true
        })
    }

    private confirmEmail() {
        this.userService.confirmEmail(this.userId, this.token).subscribe(result => {
            alert(result)
        })
    }

}
