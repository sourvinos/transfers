import { AbstractControl, ValidationErrors } from '@angular/forms';

export class DescriptionValidators {
	static cannotExceedMaxLength(control: AbstractControl): ValidationErrors | null {
		if ((control.value as string).length > 10) {
			return { cannotExceedMaxLength: true }
		} else {
			return null;
		}
	}
}