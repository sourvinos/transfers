import { FormGroup, FormControl, FormGroupDirective, NgForm, ValidatorFn } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material'

export class CustomValidators {
    static childrenEqual: ValidatorFn = (formGroup: FormGroup) => {
        const [firstControlName, ...otherControlNames] = Object.keys(formGroup.controls || {})
        const isValid = otherControlNames.every(controlName => formGroup.get(controlName).value === formGroup.get(firstControlName).value)
        return isValid ? null : { childrenNotEqual: true }
    }
}

export class ConfirmValidParentMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return control.parent.invalid && control.touched
    }
}
export const regExps: { [key: string]: RegExp } = {
    password: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{10,128}$/
}

export const errorMessages: { [key: string]: string } = {
    password: 'Password must be between 10 and 128 characters, and contain at least one number and special character',
    confirmPassword: 'Passwords must match'
}
