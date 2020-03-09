import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Utils } from '../../shared/classes/utils';
import { KeyboardShortcuts, Unlisten } from '../../shared/services/keyboard-shortcuts.service';
import { AccountService } from '../classes/account.service';

@Component({
    selector: 'forgot-password-form',
    templateUrl: './forgot-password-form.html',
    styleUrls: ['../../shared/styles/forms.css']
})

export class ForgotPasswordFormComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Variables

    id: string
    url = '/login'

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    form = this.formBuilder.group({
        id: '',
        email: ['', [Validators.required, Validators.maxLength(100)]],
    })

    // #endregion

    constructor(private accountService: AccountService, private formBuilder: FormBuilder, private router: Router, public dialog: MatDialog, private keyboardShortcutsService: KeyboardShortcuts, private snackbarService: SnackbarService) { }

    ngOnInit() {
        this.addShortcuts()
    }

    ngAfterViewInit() {
        this.focus('email')
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
    saveRecord() {
        if (!this.form.valid) { return }
        this.accountService.forgotPassword(this.form.value).subscribe(() => {
            this.showSnackbar('Token created', 'info')
            this.goBack()
        }, () => {
            this.showSnackbar('Token not created', 'danger')
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
            }
        }, {
            priority: 2,
            inputs: true
        })
    }

    /**
     * Caller(s):
     *  Class - ngAfterViewInit()
     * @param field
     */
    private focus(field: string) {
        Utils.setFocus(field)
    }

    /**
     * Caller(s):
     *  Template - goBack()
     *
     * Description:
     *  On escape navigates to the list
     */
    private goBack() {
        this.router.navigate([this.url])
    }

    /**
     * Caller(s):
     *  Class - saveRecord()
     */
    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    // #region Helper properties

    get email() {
        return this.form.get('email')
    }

    // #endregion

}
