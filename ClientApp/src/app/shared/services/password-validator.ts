import { AbstractControl } from '@angular/forms'

export function PasswordValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.get('password')
    const confirmPassword = control.get('confirmPassword')
    const validationFailed = password && confirmPassword && !password.pristine && !confirmPassword.pristine && password.value !== confirmPassword.value

    return validationFailed ? { 'mismatch': { value: true } } : null
}
