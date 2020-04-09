import { AbstractControl } from '@angular/forms'

export class FieldValidators {

    static cannotContainSpace(control: AbstractControl) {
        if ((control.value as string).indexOf(' ') !== -1) {
            return { cannotContainSpace: true }
        }
        return null
    }

}
