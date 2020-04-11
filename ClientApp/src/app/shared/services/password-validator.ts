import { FormGroup } from '@angular/forms'

export function PasswordValidator(form: FormGroup) {
    const condition = form.get('password').value !== form.get('confirmPassword').value
    return condition ? { passwordsDoNotMatch: true } : null
}
