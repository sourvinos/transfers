import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })

export class HelperService {

    getUsernameFromLocalStorage() {
        return localStorage.getItem('userName') != null || undefined ? localStorage.getItem('userName') : 'Sourvinos'
    }

    getDateFromLocalStorage() {
        return localStorage.getItem('date')
    }

}
