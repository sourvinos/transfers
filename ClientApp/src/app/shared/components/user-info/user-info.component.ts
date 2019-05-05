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

	userName() {
		let decodedToken = jwt_decode(this.service.getToken());
		let userName = decodedToken['sub'];

		return userName;
	}

}
