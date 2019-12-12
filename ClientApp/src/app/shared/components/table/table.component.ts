import { AfterViewInit, Component, Input } from '@angular/core';
import { InteractionService } from './../../services/interaction.service';
import { IndexInteractionService } from '../../services/index-interaction.service';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css']
})

export class TableComponent implements AfterViewInit {

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

    constructor(private indexInteractionService: IndexInteractionService) { }

    ngAfterViewInit() {
        setTimeout(() => {
            // this.calculateDimensions()
        }, 500)
    }

    // T
    editRecord(rowIndex: any) {
        this.indexInteractionService.sendObject(this.records[rowIndex])
    }

    // T
    selectRow(rowIndex: number) {
        // this.clearAllRowHighlights()
        // this.gotoRow(this.table, rowIndex + 1)
        console.log('Sending:', this.records[rowIndex])
        this.indexInteractionService.sendObject(this.records[rowIndex])
    }

    private calculateDimensions() {
        this.table = document.getElementById('index-table')
        this.tableParentNode = document.getElementById('index-table').parentNode.parentNode
        console.log('Parent node', this.tableParentNode)
        this.rowHeight = this.table.rows[1].offsetHeight
        if (this.tableParentNode.scrollHeight <= this.tableParentNode.offsetHeight) {
            this.tableParentNode.style.overflowY = 'hidden'
            this.table.style.marginRight = '0px'
        }
    }

    private clearAllRowHighlights() {
        this.table.querySelectorAll('tr').forEach((element: { classList: { remove: (arg0: string) => void } }) => {
            element.classList.remove('selected')
        })
    }

    private gotoRow(table: HTMLTableElement, rowIndex: number) {
        table.rows[rowIndex].classList.toggle('selected')
        this.indexInteractionService.sendObject(this.records[rowIndex - 1])
    }

}