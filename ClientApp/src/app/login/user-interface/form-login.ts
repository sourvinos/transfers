import { Component, AfterViewInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { AccountService } from '../../services/account.service'
import { CountdownService } from '../../services/countdown.service'
import { Utils } from 'src/app/shared/classes/utils'

@Component({
	selector: 'form-login',
	templateUrl: './form-login.html',
	styleUrls: ['../../shared/styles/forms.css', './form-login.css']
})

export class LoginComponent implements AfterViewInit {

	// #region Variables

	errorMessage: string
	countdown: number = 0
	invalidLogin: boolean
	returnUrl: string

	form = this.formBuilder.group({
		userName: ['aa', Validators.required],
		password: ['Abc!123456', Validators.required]
	})

	// #endregion

	constructor(private service: AccountService, private countdownService: CountdownService, private router: Router, private formBuilder: FormBuilder) { }

	ngAfterViewInit() {
		this.focus('userName')
	}

	// T
	login() {
		let userlogin = this.form.value
		this.service.login(userlogin.userName, userlogin.password).subscribe(result => {
			let token = (<any>result).authToken.token
			this.invalidLogin = false
			this.router.navigateByUrl(this.returnUrl)
			this.countdownService.reset()
			this.countdownService.countdown.subscribe(data => { this.countdown = data })
		},
			error => {
				this.invalidLogin = true
				this.errorMessage = error.error.loginError
			})
	}

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

	// //#endregion


}
