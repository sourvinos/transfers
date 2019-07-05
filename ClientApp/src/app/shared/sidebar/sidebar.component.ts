import { AuthService } from '../../services/auth.service';
import { Component } from '@angular/core';

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent {

    constructor(private service: AuthService) { }

    triggerEvent(elem: HTMLElement, event: string) {
        let clickEvent = new Event(event);

        elem.dispatchEvent(clickEvent);
    }

    isLoggedIn(): boolean {
        return this.service.isLoggedIn();
    }

    isTokenExpired(): boolean {
        return this.service.isTokenExpired();
    }

    logout() {
        this.service.logout()
    }

    userName() {
        let token = this.service.getDecodedToken();
        let userName = token['sub'];

        return userName;
    }

    closeSidebar() {
        var slide = document.getElementById("slide");

        if (slide.className == "open") {
            this.triggerEvent(slide, "click");
        };
    }
}
