import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AccountService } from './account.service';
import { CanDeactivate } from '@angular/router';

export interface CanComponentDeactivate {
    confirm(): boolean
}

@Injectable({ providedIn: 'root' })

export class AuthGuardService implements CanActivate, CanDeactivate<CanComponentDeactivate> {

    component: Object;
    route: ActivatedRouteSnapshot;

    constructor(private accountService: AccountService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.accountService.isLoggedIn.pipe(take(1), map((loginStatus: boolean) => {
            const destination: string = state.url
            if (!loginStatus) {
                this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } })
                return false
            }
            return true
        }))
    }

    canDeactivate(component: CanComponentDeactivate, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return component.confirm()
    }
}
