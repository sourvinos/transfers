import { AbstractControl } from '@angular/forms'

export class CrossFieldValidators {

    static cannotBeDifferent(control: AbstractControl) {
        const password = control.get('password')
        const confirmPassword = control.get('confirmPassword')
        if (password && confirmPassword && !password.pristine && !confirmPassword.pristine && password.value !== confirmPassword.value) {
            return { cannotBeDifferent: true }
        }
        return null
    }

}
