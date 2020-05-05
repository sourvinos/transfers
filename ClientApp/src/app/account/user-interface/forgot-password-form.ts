import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AccountService } from 'src/app/shared/services/account.service';
import { ButtonClickService } from 'src/app/shared/services/button-click.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Utils } from '../../shared/classes/utils';
import { KeyboardShortcuts, Unlisten } from '../../shared/services/keyboard-shortcuts.service';

@Component({
    selector: 'forgot-password-form',
    templateUrl: './forgot-password-form.html',
    styleUrls: ['../../shared/styles/forms.css']
})

export class ForgotPasswordFormComponent implements OnInit, AfterViewInit, OnDestroy {

    loginUrl = '/login'
    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    form = this.formBuilder.group({
        email: ['johnsourvinos@hotmail.com', [Validators.required, Validators.email]]
    })

    constructor(private accountService: AccountService, private formBuilder: FormBuilder, private router: Router, private keyboardShortcutsService: KeyboardShortcuts, private snackbarService: SnackbarService, private buttonClickService: ButtonClickService) { }

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

    onSave() {
        const form = this.form.value;
        this.accountService.forgotPassword(form.email).subscribe((response) => {
            this.showSnackbar(response.response, 'info')
            this.onGoBack()
        });
    }

    onGoBack() {
        this.router.navigate([this.loginUrl])
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
            }
        }, {
            priority: 1,
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
