import { AuthService } from './../../../services/auth.service';
import { Component } from '@angular/core';
import * as jwt_decode from 'jwt-decode';

@Component({
	selector: 'user-info',
	templateUrl: './user-info.component.html',
	styleUrls: ['./user-info.component.css']
})

export class UserInfoComponent {

	constructor(private service: AuthService) { }

	isLoggedIn(): boolean {
		return this.service.isLoggedIn();
	}

	isTokenExpired(): boolean {
		return this.service.isTokenExpired();
	}

	userName() {
		let token = this.service.getDecodedToken();
		let userName = token['sub'];

		return userName;
	}

}
