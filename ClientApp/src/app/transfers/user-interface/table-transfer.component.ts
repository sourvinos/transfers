import { Component, Input } from '@angular/core';
import { InteractionService } from 'src/app/shared/services/interaction.service';

@Component({
    selector: 'app-transfer-table',
    templateUrl: './table-transfer.component.html',
    styleUrls: ['./table-transfer.component.css']
})

export class TransferTableComponent {

    // #region Init

    @Input() records: any[]

    @Input() headers: any
    @Input() widths: any
    @Input() visibility: any
    @Input() justify: any
    @Input() fields: any

    tableParentNode: any
    table: any
    rowHeight: number = 0

    // #endregion

    constructor(private interactionService: InteractionService) { }

    // T
    editRecord(rowIndex: any) {
        this.interactionService.sendObject(this.records[rowIndex])
    }

    // T
    selectRow(rowIndex: number) {
        this.interactionService.sendObject(this.records[rowIndex])
    }

}
