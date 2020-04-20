import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })

export class HelperService {

    getUsernameFromLocalStorage() {
        return localStorage.getItem('username')
    }

    getDateFromLocalStorage() {
        return localStorage.getItem('date')
    }

}
