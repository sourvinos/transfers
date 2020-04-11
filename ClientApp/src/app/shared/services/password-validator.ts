import { FormGroup } from '@angular/forms'

export function PasswordValidator(form: FormGroup) {
    const condition = form.get('passwords.password').value !== form.get('passwords.confirmPassword').value
    return condition ? { passwordsDoNotMatch: true } : null
}
