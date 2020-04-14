import { Location } from '@angular/common'
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { Utils } from '../../shared/classes/utils'
import { KeyboardShortcuts, Unlisten } from '../../shared/services/keyboard-shortcuts.service'
import { UserService } from '../classes/user.service'

@Component({
    selector: 'edit-user-form',
    templateUrl: './edit-user-form.html',
    styleUrls: ['../../shared/styles/forms.css']
})

export class EditUserFormComponent implements OnInit, AfterViewInit, OnDestroy {

    form: FormGroup
    url = '/users'
    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>()

    constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private keyboardShortcutsService: KeyboardShortcuts, private dialogService: DialogService, private snackbarService: SnackbarService, private location: Location) {
        this.activatedRoute.params.subscribe(p => {
            if (p.id) { this.getRecord(p.id) }
        })
    }

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

    onChangePassword() {
        // const link: any = this.location.path() + '/changePassword'
        // this.router.navigate(link)
        // this.router.navigate(['/users/' + this.form.value.id + '/changePassword'])
        this.router.navigate(['/users/changePassword/' + this.form.value.id])
    }

    onDelete() {
        this.dialogService.open('Warning', '#FE9F36', 'If you continue, this record will be permanently deleted.', ['ok', 'cancel']).subscribe(question => {
            if (question) {
                this.userService.delete(this.form.value.id).subscribe((response) => {
                    this.showSnackbar(response.response, 'info')
                    this.resetForm()
                    this.goBack()
                })
            }
        })
    }

    onSave() {
        this.userService.update(this.form.value.id, this.form.value).subscribe((response) => {
            this.showSnackbar(response.response, 'info')
            this.resetForm()
            this.goBack()
        }, error => {
            this.showSnackbar(error.error.response, 'error')
        })
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.goBack()
                }
            },
            'Alt.D': (event: KeyboardEvent) => {
                event.preventDefault()
                this.onDelete()
            },
            'Alt.S': (event: KeyboardEvent) => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0 && this.form.valid) {
                    event.preventDefault()
                    this.onSave()
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

    private initForm() {
        this.form = this.formBuilder.group({
            id: '',
            username: ['', [Validators.required, Validators.maxLength(32)]],
            displayname: ['', [Validators.required, Validators.maxLength(32)]],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(128)]],
        })

    }

    private getRecord(id: string) {
        this.userService.getSingle(id).then(result => {
            this.populateFields(result)
        })
    }

    private goBack() {
        this.router.navigate([this.url])
    }

    private populateFields(result: any) {
        this.form.setValue({
            id: result.id,
            username: result.username,
            displayname: result.displayname,
            email: result.email
        })
    }

    private resetForm() {
        this.form.reset()
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }

    // #region Helper properties
    get Username() {
        return this.form.get('username')
    }

    get Displayname() {
        return this.form.get('displayname')
    }

    get Email() {
        return this.form.get('email')
    }

    // #endregion

}
