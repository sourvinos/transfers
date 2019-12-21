import { AfterViewInit, Component, HostListener, Input, OnInit } from '@angular/core';
import { InteractionService } from '../classes/interaction.service';
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
    rowHeaderHeight: any
    table: any
    rowHeight: number = 0
    rowCount: number = 0

    // #endregion

    constructor(private transferInteractionService: InteractionTransferService, private interactionService: InteractionService) { }

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

    private gotoRow(key: string) {
        if (!isNaN(parseInt(key))) {
            this.clearAllRowHighlights()
            // this.highlightRow(this.table, key)
        }
        if (key == 'Enter') {
            this.sendRowToService(false)
        }
        if (key == 'ArrowUp' && this.currentRow > 1) {
            this.clearAllRowHighlights()
            // this.highlightRow(this.table, 'up')
            if (!this.isRowIntoView(this.table.rows[this.currentRow], key)) {
                document.getElementById(this.currentRow.toString()).scrollIntoView()
                this.indexContent.scrollTop = (this.currentRow - 1) * this.rowHeight
            }
        }
        if (key == 'ArrowDown' && this.currentRow < this.rowCount) {
            this.clearAllRowHighlights()
            // this.highlightRow(this.table, 'down')
            if (!this.isRowIntoView(this.table.rows[this.currentRow], key)) {
                document.getElementById(this.currentRow.toString()).scrollIntoView({ block: "end", behavior: "smooth" })
            }
        }
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

    private sendRowToService(dialogMustClose?: boolean) {
        this.transferInteractionService.sendObject([this.records[this.currentRow - 1], dialogMustClose])
    }

    private calculateDimensions() {
        setTimeout(() => {
            this.indexContent = document.getElementById('table-transfer').parentNode.parentNode
            this.table = document.getElementById('table-transfer')
            this.rowHeaderHeight = document.querySelector('thead')
            // this.rowHeight = this.table.rows[1].offsetHeight
            this.rowHeight = 50
            if (this.indexContent.scrollHeight <= this.indexContent.offsetHeight) {
                this.indexContent.style.overflowY = 'hidden'
                this.table.style.marginRight = '0px'
            }
            this.rowCount = this.table.rows.length - 1
            document.getElementById('table-input').focus()
            this.gotoRow('1')
        }, 2000);
    }

}
