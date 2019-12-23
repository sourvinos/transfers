import { Component, HostListener, AfterViewInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { AccountService } from './../services/account.service';

@Component({
    selector: 'root',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.css']
})

export class RootComponent implements AfterViewInit {

    showLoadingIndication: boolean = true

    constructor(private accountService: AccountService, private router: Router) {
        this.router.events.subscribe((routerEvent) => {
            if (routerEvent instanceof NavigationStart) {
                this.showLoadingIndication = true
            }
            if (routerEvent instanceof NavigationEnd || routerEvent instanceof NavigationCancel || routerEvent instanceof NavigationError) {
                this.showLoadingIndication = false
            }
        })
    }

    @HostListener('window:resize', ['$event']) onResize(event: { target: { innerWidth: any; }; }) { }

    @HostListener('window:beforeunload', ['$event']) beforeUnloadHander() {
        this.accountService.logout()
    }

    ngAfterViewInit() {
        document.getElementById('spinner').style.left = document.getElementById('sidebar').clientWidth + 'px'
        document.getElementById('spinner').style.top = document.getElementById('sidebar').clientHeight - 24 - document.getElementById('spinner').clientHeight + 'px'
    }

}
