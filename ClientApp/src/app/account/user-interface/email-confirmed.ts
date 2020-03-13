import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AccountService } from 'src/app/shared/services/account.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { KeyboardShortcuts, Unlisten } from '../../shared/services/keyboard-shortcuts.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'email-confirmed',
    templateUrl: './email-confirmed.html',
    styleUrls: ['../../shared/styles/forms.css', './email-confirmed.css']
})

export class EmailConfirmedComponent implements OnInit, OnDestroy {

    // #region Variables


    id = '7f5cf428-6cae-400a-9cc3-a5033a6647e1'
    token = 'CfDJ8MjXBd69tQJPoUGQUWpMOnkaqo3Slt%2B2tQNDnULNlBt4Yio%2Fo1vspxDouE4eIuQn9ri3E2ssjovlmbDXUdiRasMmi4XmGVRTyR4TyiNGVMuQVlvlqLjCSz08avZFrbTlIySZtzc%2BiFS7XblZo3V9ds28on4uCsM0Mlo6EMrRJuP8Bir4Xj9rHv2I5L7pT4uuKjazoOk5m8bTBdi0ET%2FYoXNy39noKi3vRc%2FbJJUpZenRQd6%2FuPtiS6Twy1oLxkjROQ%3D%3D'

    url: string
    snapshot: { userId: string, token: string }

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    // #endregion

    constructor(private http: HttpClient, private accountService: AccountService, private router: Router, private keyboardShortcutsService: KeyboardShortcuts, private snackbarService: SnackbarService, private activatedRoute: ActivatedRoute) {
        this.snapshot = {
            userId: '7f5cf428-6cae-400a-9cc3-a5033a6647e1',
            token: 'CfDJ8MjXBd69tQJPoUGQUWpMOnkaq'
        }
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
        this.router.navigateByUrl('login')
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
        this.accountService.confirmEmail(this.snapshot.userId).subscribe(result => {
            alert(result)
        })
    }

}
