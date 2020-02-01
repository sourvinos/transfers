import { Injectable } from '@angular/core'
import { Resolve } from '@angular/router'
import { Observable } from 'rxjs'
import { User } from './model-user'
import { UserService } from './service-api-user'

@Injectable({ providedIn: 'root' })

export class UserListResolverService implements Resolve<User[]>{

    constructor(private userService: UserService) { }

    resolve(): Observable<User[]> {
        return this.userService.getAll()
    }

}