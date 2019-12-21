import { AfterViewInit, Component, HostListener, Input, OnInit, OnChanges, DoCheck } from '@angular/core';
import { InteractionTransferService } from '../classes/service-interaction-transfer';

@Component({
    selector: 'table-transfer',
    templateUrl: './table-transfer.html',
    styleUrls: ['./table-transfer.css']
})

export class TableTransferComponent implements OnInit, AfterViewInit {

    // #region Init

    @Input() records: any[]

    @Input() headers: any
    @Input() widths: any
    @Input() visibility: any
    @Input() justify: any
    @Input() fields: any

    currentRow: number = 0
    indexContent: any
    tableParentNode: any
    table: any
    rowHeight: number = 0
    rowCount: number = 0

    // #endregion

    constructor(private transferInteractionService: InteractionTransferService) { }

    ngOnInit() { }

    ngAfterViewInit() {
        this.calculateDimensions()
    }

    @HostListener('keyup', ['$event']) onkeyup(event: { key: string; target: { getAttribute: { (arg0: string): void; (arg0: string): void } } }) {
        this.gotoRow(event.key)
    }

    private clearAllRowHighlights() {
        this.table.querySelectorAll('tr').forEach((element: { classList: { remove: (arg0: string) => void; }; }) => {
            element.classList.remove('selected')
        })
    }

    private gotoRow(key: any) {
        if (!isNaN(key)) {
            this.clearAllRowHighlights()
            this.highlightRow(this.table, key)
        }
        if (key == 'Enter') {
            this.sendRowToService()
        }
        if (key == 'ArrowUp' && this.currentRow > 1) {
            this.deselectCurrentRow()
            this.highlightRow(this.table, 'up')
            if (!this.isRowIntoView(this.table.rows[this.currentRow], key)) {
                document.getElementById(this.currentRow.toString()).scrollIntoView()
                this.indexContent.scrollTop = (this.currentRow - 1) * this.rowHeight
            }
        }
        if (key == 'ArrowDown' && this.currentRow < this.rowCount) {
            this.deselectCurrentRow()
            this.highlightRow(this.table, 'down')
            if (!this.isRowIntoView(this.table.rows[this.currentRow], key)) {
                document.getElementById(this.currentRow.toString()).scrollIntoView({ block: "end", behavior: "smooth" })
            }
        }
    }

    private deselectCurrentRow() {
        this.table.rows[this.currentRow].classList.remove('selected')
    }

    private highlightRow(table: HTMLTableElement, direction: any) {
        if (!isNaN(direction)) {
            this.currentRow = parseInt(direction)
        } else {
            if (direction == 'up') this.currentRow--
            if (direction == 'down')++this.currentRow
        }
        table.rows[this.currentRow].classList.toggle('selected')
    }

    private isRowIntoView(row: HTMLTableRowElement, direction: string) {
        const rowOffsetTop = row.offsetTop
        const indexContentScrollTop = this.indexContent.scrollTop
        const rowOffetTopPlusRowOffsetHeight = rowOffsetTop + row.offsetHeight
        const indexContentScrollTopPuslIndexContentOffsetHeight = indexContentScrollTop + this.indexContent.offsetHeight
        if (direction == 'ArrowUp') {
            if (indexContentScrollTopPuslIndexContentOffsetHeight - rowOffsetTop + this.rowHeight < this.indexContent.offsetHeight) {
                return true
            } else {
                return false
            }
        }
        if (direction == 'ArrowDown') {
            if (rowOffetTopPlusRowOffsetHeight <= indexContentScrollTopPuslIndexContentOffsetHeight) {
                return true
            } else {
                return false
            }
        }
    }

    private sendRowToService() {
        console.log('sending', this.records[this.currentRow - 1])
        this.transferInteractionService.sendObject(this.records[this.currentRow - 1])
    }

    private calculateDimensions() {
        setTimeout(() => {
            this.table = document.getElementById('table-transfer')
            this.indexContent = document.getElementById('table-transfer').parentNode.parentNode
            this.rowHeight = 50
            if (this.indexContent.scrollHeight <= this.indexContent.offsetHeight) {
                this.indexContent.style.overflowY = 'hidden'
                this.table.style.marginRight = '0px'
            }
            this.rowCount = this.table.rows.length - 1
            document.getElementById('table-input').focus()
            this.gotoRow(1)
        }, 1000);
    }

}
