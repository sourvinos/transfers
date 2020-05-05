import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AccountService } from 'src/app/shared/services/account.service';
import { ButtonClickService } from 'src/app/shared/services/button-click.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { RegisterUser } from '../../account/classes/register-user';
import { Utils } from '../../shared/classes/utils';
import { KeyboardShortcuts, Unlisten } from '../../shared/services/keyboard-shortcuts.service';
import { ConfirmValidParentMatcher, ValidationService } from '../../shared/services/validation.service';

@Component({
    selector: 'register-user-form',
    templateUrl: './register-user-form.html',
    styleUrls: ['../../shared/styles/forms.css', './register-user-form.css']
})

export class RegisterUserFormComponent implements OnInit, AfterViewInit, OnDestroy {

    flatForm: RegisterUser
    form: FormGroup
    hidePassword = true
    usersUrl = '/users'
    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();
    confirmValidParentMatcher = new ConfirmValidParentMatcher();

    constructor(private accountService: AccountService, private router: Router, private formBuilder: FormBuilder, private keyboardShortcutsService: KeyboardShortcuts, private dialogService: DialogService, private snackbarService: SnackbarService, private messageService: MessageService, private buttonClickService: ButtonClickService) { }

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

    canDeactivate() {
        if (this.form.dirty) {
            this.dialogService.open('Warning', 'warningColor', this.messageService.askConfirmationToAbortEditing(), ['cancel', 'ok']).subscribe(response => {
                if (response) {
                    this.resetForm()
                    this.onGoBack()
                    return true
                }
            })
        } else {
            return true
        }
    }

    onResetForm() {
        this.form.reset()
    }

    onSave() {
        this.flattenFormFields();
        this.accountService.register(this.flatForm).subscribe((response) => {
            this.showSnackbar(response.response, 'info')
            this.resetForm()
            this.onGoBack()
        }, error => {
            this.showSnackbar(error.error.response, 'error')
        })
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': (event: KeyboardEvent): void => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.buttonClickService.clickOnButton(event, 'goBack')
                }
            },
            'Control.S': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.buttonClickService.clickOnButton(event, 'save')
                }
            },
            'Control.C': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length !== 0) {
                    this.buttonClickService.clickOnButton(event, 'cancel')
                }
            },
            'Control.O': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length !== 0) {
                    this.buttonClickService.clickOnButton(event, 'ok')
                }
            }
        }, {
            priority: 1,
            inputs: true
        })
    }

    private flattenFormFields() {
        this.flatForm = {
            email: this.form.value.email,
            displayName: this.form.value.displayName,
            username: this.form.value.username,
            password: this.form.value.passwords.password,
            confirmPassword: this.form.value.passwords.confirmPassword
        }
    }

    private focus(field: string) {
        Utils.setFocus(field)
    }

    private initForm() {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email, Validators.maxLength(128)]],
            displayName: ['', [Validators.required, Validators.maxLength(32)]],
            username: ['', [Validators.required, Validators.maxLength(32)]],
            passwords: this.formBuilder.group({
                password: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(128), ValidationService.containsSpace]],
                confirmPassword: ['', [Validators.required]]
            }, { validator: ValidationService.childrenEqual })
        })
    }

    private onGoBack() {
        this.router.navigate([this.usersUrl])
    }

    private resetForm() {
        this.form.reset()
    }

    private showSnackbar(message: string | string[], type: string): void {
        this.snackbarService.open(message, type)
    }

    // #region Helper properties

    get Email() {
        return this.form.get('email')
    }

    get DisplayName() {
        return this.form.get('displayName')
    }

    get Username() {
        return this.form.get('username')
    }

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
