import { Component, Input } from '@angular/core';
import { InteractionService } from 'src/app/shared/services/interaction.service';

@Component({
    selector: 'table-transfer',
    templateUrl: './table-transfer.html',
    styleUrls: ['./table-transfer.css']
})

export class TableTransferComponent {

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

    /**
     * Sends the selected record to the list
     * @param rowIndex 
     */
    editRecord(rowIndex: any) {
        this.interactionService.sendObject(this.records[rowIndex])
    }

    /**
     * Sends the selected record to the list
     * @param rowIndex 
     */
    selectRow(rowIndex: number) {
        this.interactionService.sendObject(this.records[rowIndex])
    }

}
