import { Component, Input } from '@angular/core'
import { ITransfer } from '../models/transfer'

@Component({
    selector: 'app-transfer-item',
    templateUrl: './transfer-item.component.html',
    styleUrls: ['./transfer-item.component.css']
})

export class TransferItemComponent {

    @Input() transfer: ITransfer
    @Input() id: Number

}
