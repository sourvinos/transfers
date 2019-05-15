import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent {

	validLogin: boolean = true;

	constructor(private formBuilder: FormBuilder, private service: AuthService, private router: Router) { }

	form = this.formBuilder.group({
		userName: ['', Validators.required],
		password: ['', Validators.required]
	})

	get userName() {
		return this.form.get('userName');
	}

	get password() {
		return this.form.get('password');
	}

	getErrorMessage() {
		return 'This field is required!';
	}

	login() {
		this.service.login(this.form.value).subscribe((response: any) => {
			if (response && response.token) {
				this.validLogin = true;
				this.router.navigate(['/'])
				localStorage.setItem('token', response.token);
			}
		}, () => {
			this.validLogin = false;
		});
	}

}
