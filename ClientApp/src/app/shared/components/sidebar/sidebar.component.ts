import { AfterViewInit, Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { AccountService } from '../../services/account.service'
import { CountdownService } from '../../services/countdown.service'
import { Router } from '@angular/router'

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit, AfterViewInit {

    countdown = 0
    isNotLoaded = true
    loginStatus: Observable<boolean>
    displayName: Observable<string>

    constructor(private accountService: AccountService, private countdownService: CountdownService, private router: Router) {
        this.countdownService.reset()
        this.countdownService.countdown.subscribe(data => { this.countdown = data })
    }

    ngOnInit() {
        this.loginStatus = this.accountService.isLoggedIn
        this.displayName = this.accountService.currentDisplayName
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.isNotLoaded = false
        }, 1000);
    }

    triggerEvent(elem: HTMLElement, event: string) {
        const clickEvent = new Event(event)
        elem.dispatchEvent(clickEvent)
    }

    logout() {
        this.accountService.logout()
    }

    closeSidebar() {
        const hamburger = document.getElementById('hamburger')
        if (hamburger.className === 'open') {
            this.triggerEvent(hamburger, 'click')
        }
    }

}
