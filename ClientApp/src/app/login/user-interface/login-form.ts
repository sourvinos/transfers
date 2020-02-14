import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { Utils } from 'src/app/shared/classes/utils'
import { AccountService } from '../../shared/services/account.service'
import { CountdownService } from '../../shared/services/countdown.service'

@Component({
    selector: 'login-form',
    templateUrl: './login-form.html',
    styleUrls: ['../../shared/styles/forms.css', './login-form.css']
})

export class LoginFormComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Variables

    countdown = 0
    invalidLogin: boolean
    returnUrl: string

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    form = this.formBuilder.group({
        userName: ['maria', Validators.required],
        password: ['Abc!123456', Validators.required]
    })

    // #endregion

    constructor(private service: AccountService, private countdownService: CountdownService, private router: Router, private formBuilder: FormBuilder, private keyboardShortcutsService: KeyboardShortcuts) { }

    ngOnInit() {
        this.addShortcuts()
    }

    ngAfterViewInit() {
        this.focus('userName')
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    /**
     * Caller(s):
     *  Template - login()
     *
     * Description:
     *  Self-explanatory
     */
    login() {
        const userlogin = this.form.value
        this.service.login(userlogin.userName, userlogin.password).subscribe(() => {
            this.invalidLogin = false
            this.router.navigateByUrl(this.returnUrl)
            this.countdownService.reset()
            this.countdownService.countdown.subscribe(data => { this.countdown = data })
        })
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
     *
     * Description:
     *  Self-explanatory
     */
    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Alt.L': (event: KeyboardEvent): void => {
                event.preventDefault()
                this.login()
            }
        }, {
            priority: 2,
            inputs: true
        })
    }

    /**
     * Caller(s):
     *  Class - ngAfterViewInit()
     * Description:
     *  Calls the public method()
     *
     * @param field
     */
    private focus(field: string) {
        Utils.setFocus(field)
    }

    // #region Helper properties

    get userName() {
        return this.form.get('userName')
    }

    get password() {
        return this.form.get('password')
    }

    // #endregion

}
