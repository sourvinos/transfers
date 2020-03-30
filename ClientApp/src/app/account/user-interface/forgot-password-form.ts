import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AccountService } from 'src/app/shared/services/account.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Utils } from '../../shared/classes/utils';
import { KeyboardShortcuts, Unlisten } from '../../shared/services/keyboard-shortcuts.service';

@Component({
    selector: 'forgot-password-form',
    templateUrl: './forgot-password-form.html',
    styleUrls: ['../../shared/styles/forms.css']
})

export class ForgotPasswordFormComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Variables

    url = '/login'
    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    form = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
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

    onSubmit() {
        if (!this.form.valid) { return }
        this.accountService.forgotPassword(this.form.value.email).subscribe(() => {
            this.showSnackbar('Email sent', 'info')
            this.goBack()
        }, () => {
            this.showSnackbar('Email not sent', 'danger')
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

    get email() {
        return this.form.get('email')
    }

    // #endregion

}
