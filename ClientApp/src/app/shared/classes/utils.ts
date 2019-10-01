import { Subject } from "rxjs";
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalDialogComponent } from "../components/modal-dialog/modal-dialog.component";

export class Utils {

	static modalService: BsModalService;

	public static errorLogger(message: Response) {
		console.log('Error: ' + message);
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

}