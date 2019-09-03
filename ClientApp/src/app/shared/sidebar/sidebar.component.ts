import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from '../../services/account.service';

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {

    loginStatus: Observable<boolean>
    userName: Observable<string>

    constructor(private accountService: AccountService) { }

    ngOnInit() {
        this.loginStatus = this.accountService.isLoggedIn;
        this.userName = this.accountService.currentUserName;
    }

    triggerEvent(elem: HTMLElement, event: string) {
        let clickEvent = new Event(event);
        elem.dispatchEvent(clickEvent);
    }

    logout() {
        this.accountService.logout()
    }

    closeSidebar() {
        var slide = document.getElementById("slide");

        if (slide.className == "open") {
            this.triggerEvent(slide, "click");
        };
    }
}
