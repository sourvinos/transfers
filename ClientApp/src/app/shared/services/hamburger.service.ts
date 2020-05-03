import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })

export class HamburgerService {

    positionHamburger() {
        const hamburger = document.getElementById('hamburger')
        hamburger.style.top = window.innerHeight - 68 + 'px'
        hamburger.style.marginLeft = '51px'
    }

}
