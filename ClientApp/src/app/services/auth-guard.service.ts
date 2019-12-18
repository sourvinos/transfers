import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { map, take } from 'rxjs/operators'
import { AccountService } from './account.service'

export interface CanComponentDeactivate {
    confirm(): boolean
}

@Injectable({ providedIn: 'root' })

export class AuthGuardService implements CanActivate {

    component: Object
    route: ActivatedRouteSnapshot

    constructor(private accountService: AccountService, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.accountService.isLoggedIn.pipe(take(1), map((loginStatus: boolean) => {
            if (!loginStatus) {
                this.router.navigate(['/login'])
                return false
            }
            return true
        }))
    }

}
