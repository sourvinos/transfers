import { Component } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { AccountService } from '../services/account.service'

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent {

	// Variables
	invalidLogin: boolean
	returnUrl: string
	ErrorMessage: string

	// Form fields
	form = this.formBuilder.group({
		userName: ['', Validators.required],
		password: ['', Validators.required]
	})

	// Constructor
	constructor(private service: AccountService, private router: Router, private formBuilder: FormBuilder) { }

	// Login
	login() {
		let userlogin = this.form.value

		this.service.login(userlogin.userName, userlogin.password).subscribe(result => {

			let token = (<any>result).authToken.token
			console.log(token)
			console.log(result.authToken.roles)
			console.log("User Logged In Successfully")
			this.invalidLogin = false
			console.log(this.returnUrl)
			this.router.navigateByUrl(this.returnUrl)
		},
			error => {
				this.invalidLogin = true
				this.ErrorMessage = error.error.loginError
				console.log(this.ErrorMessage)
			})

	}

	// Property
	get userName() {
		return this.form.get('userName')
	}

	// Property
	get password() {
		return this.form.get('password')
	}

	// Property
	getErrorMessage() {
		return 'This field is required!'
	}

}
