import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core'
import { AccountService } from 'src/app/services/account.service'
import { FormBuilder, Validators } from '@angular/forms'
import { KeyboardShortcuts, Unlisten } from 'src/app/services/keyboard-shortcuts.service'
import { Subject } from 'rxjs'
import { Utils } from 'src/app/shared/classes/utils'

@Component({
    selector: 'form-register',
    templateUrl: './form-register.html',
    styleUrls: ['./form-register.css']
})

export class RegisterComponent implements OnInit {

    // #region Init

    url: string = '/account/register'

    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    form = this.formBuilder.group({
        email: ['c@c.com', [Validators.required, Validators.maxLength(100)]],
        userName: ['c', [Validators.required, Validators.maxLength(100)]],
        displayName: ['Tsitos', [Validators.required, Validators.maxLength(20)]],
        password: ['Abc!@34556', [Validators.required, Validators.maxLength(100)]],
    })

    // #endregion

    constructor(private accountService: AccountService, private formBuilder: FormBuilder, private keyboardShortcutsService: KeyboardShortcuts, private http: HttpClient) { }

    ngOnInit() {
        this.addShortcuts()
    }

    ngAfterViewInit() {
        this.focus('userName')
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next()
        this.ngUnsubscribe.unsubscribe()
        this.unlisten && this.unlisten()
    }

    /**
     * Caller(s):
     *  Template - login()
     * 
     * Description:
     *  Self-explanatory
     */
    register() {
        this.accountService.register(this.form.value).subscribe(result => { console.log(result) })
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

    // #region Helper properties

    get userName() {
        return this.form.get('userName')
    }

    get password() {
        return this.form.get('password')
    }

    // #endregion

}
