import { KeyboardShortcuts, Unlisten } from "src/app/services/keyboard-shortcuts.service"

export class Utils {

	public static errorLogger(message: Response) {
		console.log('Error: ' + message)
	}

	public static disableFields(fields: string[]) {
		fields.forEach((element: string) => {
			document.getElementById(element).setAttribute('disabled', 'true')
		})
	}

	public static enableFields(fields: string[]) {
		fields.forEach((element: string) => {
			document.getElementById(element).removeAttribute('disabled')
		})
	}

	public static setFocus(element: string) {
		setTimeout(() => {
			document.getElementById(element).focus()
			document.execCommand('selectAll')
		}, 100)
	}

}