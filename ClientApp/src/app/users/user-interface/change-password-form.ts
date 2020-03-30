import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CrossFieldErrorMatcher } from 'src/app/shared/services/cross-field-matcher';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { PasswordValidator } from 'src/app/shared/services/password-validator';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Utils } from '../../shared/classes/utils';
import { KeyboardShortcuts, Unlisten } from '../../shared/services/keyboard-shortcuts.service';
import { User } from '../classes/user';
import { UserService } from '../classes/user.service';

@Component({
    selector: 'change-password-form',
    templateUrl: './change-password-form.html',
    styleUrls: ['../../shared/styles/forms.css', './change-password-form.css']
})

export class ChangePasswordFormComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Variables

    id: string
    user: User
    url = '/users'
    errorMatcher = new CrossFieldErrorMatcher()
    hidePassword = true
    flatForm: {}

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    form = this.formBuilder.group({
        id: '',
        currentPassword: ['', [Validators.required, Validators.maxLength(100)]],
        passwords: this.formBuilder.group({
            newPassword: ['', [Validators.required, Validators.maxLength(100)]],
            confirmNewPassword: [''],
        }, {
            validator: PasswordValidator
        })
    })

    // #endregion

    constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private keyboardShortcutsService: KeyboardShortcuts, private dialogService: DialogService, private snackbarService: SnackbarService) {
        this.activatedRoute.params.subscribe(p => {
            this.id = p['id']
            if (this.id) {
                this.getRecord()
            }
        });
    }

    ngOnInit() {
        this.addShortcuts()
    }

    ngAfterViewInit() {
        this.focus('currentPassword')
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten()
    }

    /**
     * Caller(s):
     *  Service - CanDeactivateGuard()
     *
     * Description:
     *  Desides which action to perform when a route change is requested
     */
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

    /**
     * Caller(s):
     *  Template - saveRecord()
     *
     * Description:
     *  Changes the current password for the logged in user
     */
    saveRecord() {
        if (!this.form.valid) { return }
        this.flattenFormFields();
        this.userService.updatePassword(this.form.value.id, this.flatForm).subscribe(() => {
            this.showSnackbar('Record updated', 'info')
            this.resetForm()
            this.goBack()
        }, error => {
            this.showSnackbar('Record not updated', 'danger')
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

    private flattenFormFields() {
        this.flatForm = {
            id: this.form.value.id,
            currentPassword: this.form.value.currentPassword,
            newPassword: this.form.value.passwords.newPassword,
            confirmNewPassword: this.form.value.passwords.confirmNewPassword
        }
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

    /**
 * Caller(s):
 *  Class - constructor()
 *
 * Description:
 *  Gets the selected record from the api
 */
    private getRecord() {
        if (this.id) {
            this.userService.getSingle(this.id).then(result => {
                this.user = result
                this.populateFields()
            })
        }
    }

    /**
     * Caller(s):
     *  Class - canDeactive(), deleteRecord(), saveRecord()
     *
     * Description:
     *  On escape navigates to the list
     */
    private goBack() {
        this.router.navigate([this.url])
    }

    /**
     * Caller(s):
     *  Class - getRecord()
     *
     * Description:
     *  Populates the form with record values
     *
     * @param result
     */
    private populateFields() {
        this.form.patchValue({
            id: this.user.id
        })
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
            userName: '',
            displayName: '',
            email: ''
        })
    }

    /**
     * Caller(s):
     *  Class - saveRecord()
     */
    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    // #region Helper properties

    get currentPassword() {
        return this.form.get('currentPassword')
    }

    get newPassword() {
        return this.form.get('newPassword')
    }

    get confirmNewPassword() {
        return this.form.get('confirmNewPassword')
    }

    // #endregion

}
