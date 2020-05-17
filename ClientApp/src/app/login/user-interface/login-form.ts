import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive';
import { HelperService } from 'src/app/shared/services/helper.service';
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service';
import { AccountService } from '../../shared/services/account.service';
import { CountdownService } from '../../shared/services/countdown.service';
import { SnackbarService } from './../../shared/services/snackbar.service';

@Component({
    selector: 'login-form',
    templateUrl: './login-form.html',
    styleUrls: ['../../shared/styles/forms.css', './login-form.css']
})

export class LoginFormComponent implements OnInit, AfterViewInit, OnDestroy {

    //#region Private
    url = '/'
    form: FormGroup
    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()
    //#endregion

    //#region Private particular
    countdown = 0
    //#endregion

    //#region Form
    hidePassword = true
    input: InputTabStopDirective
    //#endregion

    constructor(private accountService: AccountService, private countdownService: CountdownService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private snackbarService: SnackbarService) { }

    ngOnInit() {
        this.initForm()
        this.addShortcuts()
    }

    ngAfterViewInit() {
        this.focus('username')
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    public onForgotPassword() {
        this.router.navigateByUrl('/forgotPassword');
    }

    public onLogin() {
        const form = this.form.value
        this.accountService.login(form.username, form.password).subscribe(() => {
            this.router.navigateByUrl(this.url);
            this.countdownService.reset()
            this.countdownService.countdown.subscribe(data => { this.countdown = data })
        }, error => {
            this.showSnackbar(error.error.response, 'error')
        });
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Alt.L': (event: KeyboardEvent): void => {
                event.preventDefault()
                document.getElementById('login').click()
            }
        }, {
            priority: 2,
            inputs: true
        })
    }

    private focus(field: string) {
        this.helperService.setFocus(field)
    }

    private initForm() {
        this.form = this.formBuilder.group({
            username: ['sourvinos', Validators.required],
            password: ['1234567890', Validators.required]
        })
    }

    private showSnackbar(message: string | string[], type: string): void {
        this.snackbarService.open(message, type)
    }

    // #region Getters

    get Username() {
        return this.form.get('username')
    }

    get Password() {
        return this.form.get('password')
    }

    // #endregion

}
