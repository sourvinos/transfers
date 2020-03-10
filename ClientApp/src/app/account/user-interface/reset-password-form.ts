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
    selector: 'reset-password-form',
    templateUrl: './reset-password-form.html',
    styleUrls: ['../../shared/styles/forms.css']
})

export class ResetPasswordFormComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Variables

    id: string
    url = '/login'

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    form = this.formBuilder.group({
        email: ['', [Validators.required, Validators.maxLength(100)]],
    })

    // #endregion

    constructor(private accountService: AccountService, private formBuilder: FormBuilder, private router: Router, private keyboardShortcutsService: KeyboardShortcuts, private snackbarService: SnackbarService) { }

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
        this.accountService.resetPassword(this.form.value).subscribe(() => {
            this.showSnackbar('Token created', 'info')
            this.goBack()
        }, () => {
            this.showSnackbar('Token not created', 'danger')
        })
    }

    /**
     * Caller(s):
     *  Template - goBack()
     */
    goBack() {
        this.router.navigate([this.url])
    }

    /**
     * Caller(s):
     *  Class - ngOnInit()
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
                    // this.saveRecord()
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
