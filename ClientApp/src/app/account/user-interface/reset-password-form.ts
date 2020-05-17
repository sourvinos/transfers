import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive';
import { AccountService } from 'src/app/shared/services/account.service';
import { ButtonClickService } from 'src/app/shared/services/button-click.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { KeyboardShortcuts, Unlisten } from '../../shared/services/keyboard-shortcuts.service';
import { ConfirmValidParentMatcher, ValidationService } from '../../shared/services/validation.service';

@Component({
    selector: 'reset-password-form',
    templateUrl: './reset-password-form.html',
    styleUrls: ['../../shared/styles/forms.css', './reset-password-form.css']
})

export class ResetPasswordFormComponent implements OnInit, AfterViewInit, OnDestroy {

    //#region Private
    url = '/'
    form: FormGroup
    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();
    //#endregion

    //#region Private particular
    email: string
    token: string
    //#endregion

    //#region Form
    confirmValidParentMatcher = new ConfirmValidParentMatcher();
    hidePassword = true
    input: InputTabStopDirective
    //#endregion

    constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute, private buttonClickService: ButtonClickService, private formBuilder: FormBuilder, private helperService: HelperService, private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private snackbarService: SnackbarService) {
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

    public onSave() {
        const form = this.form.value;
        this.accountService.resetPassword(form.email, form.passwords.password, form.passwords.confirmPassword, form.token).subscribe((response) => {
            this.showSnackbar(response.response, 'info')
            this.router.navigate([this.url])
        }, error => {
            this.showSnackbar(error.error.response, 'error')
        })
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Alt.S': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.buttonClickService.clickOnButton(event, 'save')
                }
            }
        }, {
            priority: 1,
            inputs: true
        })
    }

    private focus(field: string) {
        this.helperService.setFocus(field)
    }

    private initForm() {
        this.form = this.formBuilder.group({
            email: [this.email],
            token: [this.token],
            passwords: this.formBuilder.group({
                password: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(128), ValidationService.containsSpace]],
                confirmPassword: ['', [Validators.required]]
            }, { validator: ValidationService.childrenEqual })
        })
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    // #region Getters

    get Passwords() {
        return this.form.get('passwords')
    }

    get Password() {
        return this.form.get('passwords.password')
    }

    get ConfirmPassword() {
        return this.form.get('passwords.confirmPassword')
    }

    get MatchingPasswords() {
        return this.form.get('passwords.password').value === this.form.get('passwords.confirmPassword').value
    }

    // #endregion

}
