import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })

export class ButtonClickService {

    clickOnButton(event: KeyboardEvent, buttonId: string) {
        event.preventDefault()
        const button = document.getElementById(buttonId)
        if (button && !button.attributes['disabled']) {
            button.click()
        }
    }

}
