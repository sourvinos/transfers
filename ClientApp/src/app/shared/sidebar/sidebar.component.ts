import { AuthService } from '../../services/auth.service';
import { Component } from '@angular/core';

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent {
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
