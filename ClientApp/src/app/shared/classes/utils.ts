import { Subject } from "rxjs"
import { BsModalService } from 'ngx-bootstrap/modal'
import { ModalDialogComponent } from "../components/modal-dialog/modal-dialog.component"

export class Utils {

	static modalService: BsModalService

	public static errorLogger(message: Response) {
		console.log('Error: ' + message)
	}

	public static openErrorModal() {
		const subject = new Subject<boolean>()
		const modal = this.modalService.show(ModalDialogComponent, {
			initialState: {
				title: 'Error',
				message: 'This record is in use and cannot be deleted.',
				type: 'error'
			}, animated: false
		})
		modal.content.subject = subject
		return subject.asObservable()
	}

	public static disableFields(fields: string[]) {
		fields.forEach((element: string) => {
			document.getElementById(element).setAttribute('disabled', 'true')
			document.getElementById(element).style.cursor = 'no-drop'
		})
	}

	public static enableFields(fields: string[]) {
		fields.forEach((element: string) => {
			document.getElementById(element).removeAttribute('disabled')
			document.getElementById(element).style.cursor = 'default'
		})
	}

	public static setFocus(element: string) {
		setTimeout(() => {
			document.getElementById(element).focus()
			document.execCommand('selectAll')
		}, 500)
	}

}