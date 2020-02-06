import { AfterViewInit, Component, HostListener } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { AccountService } from '../shared/services/account.service';

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
        this.positionLoader()
    }

    @HostListener('window:beforeunload', ['$event']) beforeUnloadHander() {
        this.accountService.logout()
    }

    ngOnInit() {
        console.clear()
    }

    ngAfterViewInit() {
        this.positionLoader()
    }

    private positionLoader() {
        document.getElementById('spinner').style.left = (window.screen.width / 2) - (document.getElementById('spinner').clientWidth / 2) + 'px'
        document.getElementById('spinner').style.top = (document.getElementById('main').clientHeight / 2) - (document.getElementById('spinner').clientHeight / 2) + 'px'
    }

}
