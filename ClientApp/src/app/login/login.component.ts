import { Component } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'

import { AccountService } from '../services/account.service'
import { CountdownService } from '../services/countdown.service'

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['../shared/styles/forms.css']
})

export class LoginComponent {

	invalidLogin: boolean
	returnUrl: string
	ErrorMessage: string
	countdown: number = 0

	form = this.formBuilder.group({
		userName: ['', Validators.required],
		password: ['', Validators.required]
	})

	constructor(private service: AccountService, private countdownService: CountdownService, private router: Router, private formBuilder: FormBuilder) { }

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
				this.ErrorMessage = error.error.loginError
			})

	}

	get userName() {
		return this.form.get('userName')
	}

	get password() {
		return this.form.get('password')
	}

	getErrorMessage() {
		return 'This field is required!'
	}

}
