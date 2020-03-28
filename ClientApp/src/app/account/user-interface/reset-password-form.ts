import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AccountService } from 'src/app/shared/services/account.service';
import { PasswordValidator } from 'src/app/shared/services/password-validator';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Utils } from '../../shared/classes/utils';
import { KeyboardShortcuts, Unlisten } from '../../shared/services/keyboard-shortcuts.service';

@Component({
    selector: 'reset-password-form',
    templateUrl: './reset-password-form.html',
    styleUrls: ['../../shared/styles/forms.css']
})

export class ResetPasswordFormComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Variables

    email: string
    token: string
    url = '/login'
    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    form = this.formBuilder.group({
        passwords: this.formBuilder.group({
            password: ['', [Validators.required, Validators.maxLength(100)]],
            confirmPassword: ['']
        }, {
            validator: PasswordValidator
        })
    })

    // #endregion

    constructor(private accountService: AccountService, private formBuilder: FormBuilder, private router: Router, private keyboardShortcutsService: KeyboardShortcuts, private snackbarService: SnackbarService, private activatedRoute: ActivatedRoute) {
        this.activatedRoute.params.subscribe(p => {
            this.email = p.email
            this.token = p.token
        })
    }

    ngOnInit() {
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

    saveRecord() {
        if (!this.form.valid) { return }
        this.accountService.resetPassword(this.email, this.form.value.passwords.password, this.form.value.passwords.confirmPassword, this.token).subscribe(() => {
            this.showSnackbar('Password has been reset', 'info')
            this.goBack()
        }, () => {
            this.showSnackbar('Token not created', 'danger')
        })
    }

    goBack() {
        this.router.navigate([this.url])
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.goBack()
                }
            },
            'Alt.S': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    event.preventDefault()
                    this.saveRecord()
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

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    // #region Helper properties

    get password() {
        return this.form.get('email')
    }

    get verifyPassword() {
        return this.form.get('verifyPassword')
    }

    // #endregion

}
