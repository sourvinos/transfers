import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';

@Component({
    selector: 'modal-dialog',
    templateUrl: './modal-dialog.component.html',
    styleUrls: ['./modal-dialog.component.css']
})

export class ModalDialogComponent {

    subject: Subject<boolean>

    constructor(public bsModalRef: BsModalRef) { }

    action(value: boolean) {
        this.bsModalRef.hide();
        this.subject.next(value);
        this.subject.complete();
    }
}