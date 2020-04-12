import { FormGroup, FormControl, FormGroupDirective, NgForm, ValidatorFn, AbstractControl } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material'

export class ValidationService {

    static childrenEqual: ValidatorFn = (formGroup: FormGroup) => {
        const [firstControlName, ...otherControlNames] = Object.keys(formGroup.controls || {})
        const isValid = otherControlNames.every(controlName => formGroup.get(controlName).value === formGroup.get(firstControlName).value)
        return isValid ? null : { childrenNotEqual: true }
    }

    static containsSpace(control: AbstractControl) {
        if (control.value && (control.value as string).indexOf(' ') !== -1) {
            return { containsSpace: true }
        }
        return null
    }

    static containsSpecialCharacters(control: AbstractControl) {
        const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]$/
        if (regex.test(control.value)) {
            return null
        }
        return { containsSpecialCharacters: true }
    }

}

export class ConfirmValidParentMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return control.parent.invalid && control.touched
    }
}
