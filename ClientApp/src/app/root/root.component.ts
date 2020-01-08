import { AfterViewInit, Component, HostListener } from '@angular/core';
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

    @HostListener('window:resize', ['$event']) onResize(event: { target: { innerWidth: void; }; }) {
        this.adjustWidth(event)
        this.positionLoader()
    }

    @HostListener('window:beforeunload', ['$event']) beforeUnloadHander() {
        this.accountService.logout()
    }

    ngAfterViewInit() {
        this.positionLoader()
    }

    private adjustWidth(event: { target: any; }) {
        event.target.innerWidth
    }

    private positionLoader() {
        document.getElementById('spinner').style.left = (document.getElementById('main').clientWidth / 2) - (document.getElementById('spinner').clientWidth / 2) + document.getElementById('sidebar').clientWidth + 'px'
        document.getElementById('spinner').style.top = (document.getElementById('main').clientHeight / 2) - document.getElementById('spinner').clientHeight / 2 + 'px'
    }

}
