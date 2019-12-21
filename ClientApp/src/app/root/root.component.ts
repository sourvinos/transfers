import { Component, HostListener } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { AccountService } from './../services/account.service';

@Component({
    selector: 'root',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.css']
})

export class RootComponent {

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

    // @HostListener('keyup', ['$event']) onkeyup(event: { key: string; target: { getAttribute: { (arg0: string): void; (arg0: string): void } } }) {
    //     const elements = Array.prototype.slice.apply(document.querySelectorAll("input[tabindex]"));
    //     if (event.key == 'Enter' || event.key == 'ArrowDown') {
    //         var nextTab = +(event.target.getAttribute('tabindex')) + 1
    //         for (var i = elements.length; i--;) {
    //             if (nextTab > elements.length) nextTab = 1
    //             if (+(elements[i].getAttribute('tabindex')) == nextTab && !elements[i].getAttribute('disabled')) {
    //                 elements[i].focus()
    //                 elements[i].select()
    //                 break
    //             }
    //         }
    //     }
    //     if (event.key == 'ArrowUp') {
    //         var previousTab = +(event.target.getAttribute('tabindex')) - 1
    //         for (var i = elements.length; i--;) {
    //             if (previousTab == 0) previousTab = elements.length
    //             if (+(elements[i].getAttribute('tabindex')) == previousTab) {
    //                 elements[i].focus()
    //                 elements[i].select()
    //                 break
    //             }
    //         }
    //     }
    // }

}
