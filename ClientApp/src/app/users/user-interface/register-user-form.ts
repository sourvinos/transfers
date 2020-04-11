import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AccountService } from 'src/app/shared/services/account.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Utils } from '../../shared/classes/utils';
import { HelperService } from '../../shared/services/helper.service';
import { KeyboardShortcuts, Unlisten } from '../../shared/services/keyboard-shortcuts.service';
import { User } from '../classes/user';
import { UserService } from '../classes/user.service';
import { PasswordValidator } from 'src/app/shared/services/password-validator';
import { CrossFieldErrorMatcher } from 'src/app/shared/services/cross-field-matcher';
import { FieldValidators } from 'src/app/shared/services/field-validators';

@Component({
    selector: 'register-user-form',
    templateUrl: './register-user-form.html',
    styleUrls: ['../../shared/styles/forms.css', './register-user-form.css']
})

export class RegisterUserFormComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Variables

    id: string
    user: User
    usersUrl = '/users'
    errorMatcher = new CrossFieldErrorMatcher()
    hidePassword = true
    form: FormGroup
    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    // #endregion

    constructor(private userService: UserService, private accountService: AccountService, private helperService: HelperService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, public dialog: MatDialog, private keyboardShortcutsService: KeyboardShortcuts, private dialogService: DialogService, private snackbarService: SnackbarService) { }

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
            this.dialogService.open('Warning', '#FE9F36', 'If you continue, changes in this record will be lost.', ['cancel', 'ok']).subscribe(response => {
                if (response) {
                    this.resetForm()
                    this.goBack()
                    return true
                }
            })
        } else {
            return true
        }
    }

    saveRecord() {
        if (!this.form.valid) { return }
        if (this.form.value.id === 0) {
            this.userService.add(this.form).subscribe(() => {
                this.showConfirmation()
                this.resetForm()
                this.goBack()
            })
        } else {
            this.userService.update(this.form.value.id, this.form.value).subscribe(() => {
                this.showSnackbar('Record updated', 'info')
                this.resetForm()
                this.goBack()
            })
        }
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
            },
            'Alt.C': (event: KeyboardEvent) => {
                event.preventDefault()
                if (document.getElementsByClassName('cdk-overlay-pane').length !== 0) {
                    document.getElementById('cancel').click()
                }
            },
            'Alt.O': (event: KeyboardEvent) => {
                event.preventDefault()
                if (document.getElementsByClassName('cdk-overlay-pane').length !== 0) {
                    document.getElementById('ok').click()
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


    private goBack() {
        this.router.navigate([this.usersUrl])
    }

    /**
     * Caller(s):
     *  Class - canDeactivate() - saveRecord()
     *
     * Description:
     *  Resets the form with default values
     */
    private resetForm() {
        this.form.reset({
            id: 0,
            username: '',
            displayName: '',
            email: '',
            password: ''
        })
    }

    /**
     * Caller(s):
     *  Class - saveRecord()
     */
    private showConfirmation() {
        this.dialogService.open('Confirmation', '#36fee0', 'We\'ve just sent you an email, so please open it and confirm your email address!', ['ok']).subscribe(response => {
            if (response) {
                this.resetForm()
                this.goBack()
                return true
            }
        })
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    private initForm() {
        this.form = this.formBuilder.group({
            id: 0,
            email: ['', [Validators.required, Validators.email, Validators.maxLength(128)]],
            displayName: ['', [Validators.required, Validators.maxLength(32)]],
            username: ['', [Validators.required, Validators.maxLength(32)]],
            passwords: this.formBuilder.group({
                password: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(128), FieldValidators.cannotContainSpace]],
                confirmPassword: ['', [Validators.required]]
            })
        })
    }

    // #region Helper properties

    get Username() {
        return this.form.get('username')
    }

    get DisplayName() {
        return this.form.get('displayName')
    }

    get Email() {
        return this.form.get('address')
    }

    get Password() {
        return this.form.get('passwords.password')
    }

    // #endregion

}
