import { AbstractControl } from '@angular/forms'

export function PasswordValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.get('password')
    const verifyPassword = control.get('verifyPassword')
    const validationFailed = password && verifyPassword && !password.pristine && !verifyPassword.pristine && password.value !== verifyPassword.value

    return validationFailed ? { 'mismatch': { value: true } } : null
}
