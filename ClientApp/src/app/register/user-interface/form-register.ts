import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
import { KeyboardShortcuts, Unlisten } from 'src/app/services/keyboard-shortcuts.service';
import { Utils } from 'src/app/shared/classes/utils';
import { Router } from '@angular/router';

@Component({
    selector: 'form-register',
    templateUrl: './form-register.html',
    styleUrls: ['../../shared/styles/forms.css']
})

export class RegisterComponent implements OnInit {

    // #region Init

    url: string = '/'

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    form = this.formBuilder.group({
        email: ['c@c.com', [Validators.required, Validators.maxLength(100)]],
        userName: ['c', [Validators.required, Validators.maxLength(100)]],
        displayName: ['Tsitos', [Validators.required, Validators.maxLength(20)]],
        password: ['Abc!@34556', [Validators.required, Validators.maxLength(100)]],
    })

    // #endregion

    constructor(private accountService: AccountService, private formBuilder: FormBuilder, private keyboardShortcutsService: KeyboardShortcuts, private router: Router) { }

    ngOnInit() {
        this.addShortcuts()
    }

    ngAfterViewInit() {
        this.focus('email')
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten && this.unlisten()
    }

    /**
     * Caller(s):
     *  Template - register()
     * 
     * Description:
     *  Self-explanatory
     */
    register() {
        if (!this.form.valid) return
        this.accountService.register(this.form.value).subscribe(result => {
            alert(result)
            if (result != null) {
                this.goBack()
            }
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
            "Alt.R": (event: KeyboardEvent): void => {
                event.preventDefault()
                this.register()
            }
        }, {
            priority: 2,
            inputs: true
        })
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
     *  Class - canDeactive(), deleteRecord(), saveRecord()
     * 
     * Description:
     *  On successful user creation, goes to the home page
     */
    private goBack() {
        this.router.navigate([this.url])
    }

    // #region Helper properties

    get userName() {
        return this.form.get('userName')
    }

    get password() {
        return this.form.get('password')
    }

    // #endregion

}
