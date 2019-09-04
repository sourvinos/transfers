// Base
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

// Custom
import { AccountService } from '../../services/account.service';
import { CountdownService } from './../../services/countdown.service';

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {

    countdown: number = 0
    loginStatus: Observable<boolean>
    userName: Observable<string>

    constructor(private accountService: AccountService, private countdownService: CountdownService) {
        this.countdownService.reset()
        this.countdownService.countdown.subscribe(data => { this.countdown = data })
    }

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
