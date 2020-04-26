import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AccountService } from 'src/app/shared/services/account.service';
import { PasswordValidator } from 'src/app/shared/services/password-validator';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Utils } from '../../shared/classes/utils';
import { KeyboardShortcuts, Unlisten } from '../../shared/services/keyboard-shortcuts.service';
import { ValidationService } from 'src/app/shared/services/validation.service';

@Component({
    selector: 'reset-password-form',
    templateUrl: './reset-password-form.html',
    styleUrls: ['../../shared/styles/forms.css', './reset-password-form.css']
})

export class ResetPasswordFormComponent implements OnInit, AfterViewInit, OnDestroy {

    email: string
    token: string
    loginUrl = '/login'
    hidePassword = true
    form: FormGroup
    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    constructor(private accountService: AccountService, private formBuilder: FormBuilder, private router: Router, private keyboardShortcutsService: KeyboardShortcuts, private snackbarService: SnackbarService, private activatedRoute: ActivatedRoute) {
        this.activatedRoute.params.subscribe(p => {
            this.email = p['email']
            this.token = p['token']
        })
    }

    ngOnInit() {
        this.initForm()
        this.addShortcuts()
    }

    ngAfterViewInit() {
        this.focus('password')
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    onSave() {
        const form = this.form.value;
        this.accountService.resetPassword(form.email, form.password, form.confirmPassword, form.token).subscribe((response) => {
            this.showSnackbar(response.response, 'info')
            this.router.navigateByUrl(this.loginUrl)
        }, error => {
            this.showSnackbar(error.error.response, 'error')
        })
    }

    onGoBack() {
        this.router.navigate([this.loginUrl])
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Alt.S': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    event.preventDefault()
                    document.getElementById('save').click()
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

    private initForm() {
        this.form = this.formBuilder.group({
            email: [this.email],
            token: [this.token],
            password: ['1234567890', [Validators.required, Validators.minLength(10), Validators.maxLength(128), ValidationService.containsSpace]],
            confirmPassword: ['1234567890', [Validators.required]],
        }, { validator: PasswordValidator })

    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    // #region Helper properties

    get Passwords() {
        return this.form.get('passwords')
    }

    get Password() {
        return this.form.get('passwords.password')
    }

    // #endregion

}
