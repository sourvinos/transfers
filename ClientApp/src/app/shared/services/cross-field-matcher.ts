import { ErrorStateMatcher } from '@angular/material'
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms'

export class CrossFieldErrorMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        if (control) {
            return (control.dirty || control.touched) && control.parent.invalid
        }
    }
}
