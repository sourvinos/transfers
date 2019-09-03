import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router'
import { Observable } from 'rxjs'
import { map, take } from 'rxjs/operators'
import { AccountService } from './account.service'

@Injectable({ providedIn: 'root' })

export class AuthGuardService implements CanActivate {

    // Constructor
    constructor(private accountService: AccountService, private router: Router) { }

    // Method
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

}
