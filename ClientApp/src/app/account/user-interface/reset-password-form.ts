import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AccountService } from 'src/app/shared/services/account.service';
import { PasswordValidator } from 'src/app/shared/services/password-validator';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Utils } from '../../shared/classes/utils';
import { KeyboardShortcuts, Unlisten } from '../../shared/services/keyboard-shortcuts.service';
import { FieldValidators } from 'src/app/shared/services/field-validators';
import { CrossFieldValidators } from 'src/app/shared/services/cross-field-validators';

@Component({
    selector: 'reset-password-form',
    templateUrl: './reset-password-form.html',
    styleUrls: ['../../shared/styles/forms.css', './reset-password-form.css']
})

export class ResetPasswordFormComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Init

    email: string
    token: string
    url = '/login'
    errorList: string[] = [];
    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    form = this.formBuilder.group({
        email: [this.email],
        token: [this.token],
        passwords: this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10), FieldValidators.cannotContainSpace]],
            confirmPassword: ['', [Validators.required]],
        }, { validator: CrossFieldValidators.cannotBeDifferent })
    })

    // #endregion

    constructor(private accountService: AccountService, private formBuilder: FormBuilder, private router: Router, private keyboardShortcutsService: KeyboardShortcuts, private snackbarService: SnackbarService, private activatedRoute: ActivatedRoute) {
        this.activatedRoute.params.subscribe(p => {
            this.email = p['email']
            this.token = p['token']
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
    onSubmit() {
        const form = this.form.value;
        this.accountService.resetPassword(form.email, form.passwords.password, form.passwords.confirmPassword, form.token).subscribe(() => {
            this.showSnackbar('Password has been reset', 'info')
            this.router.navigateByUrl('/login');
        }, error => {
            this.errorList = []
            error.error.response.forEach((element: string) => {
                this.errorList.push(element + '\n');
                console.log(element)
            })
            alert(this.errorList)
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
                    this.onSubmit()
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
    get Passwords() {
        return this.form.get('passwords')
    }

    get Password() {
        return this.form.get('passwords.password')
    }

    get ConfirmPassword() {
        return this.form.get('passwords.confirmPassword')
    }

    // #endregion

}
