import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})

export class MenuComponent {

	constructor(private service: AuthService, private router: Router) { }

	logout() {
		this.service.logout();
		this.router.navigate(['/'])
	}

}

