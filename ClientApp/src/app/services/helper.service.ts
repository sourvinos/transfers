import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class HelperService {

    getUsernameFromLocalStorage() {
        return localStorage.getItem('username') !== null || undefined ? localStorage.getItem('username') : 'Sourvinos'
    }

    getDateFromLocalStorage() {
        return localStorage.getItem('date')
    }

}
