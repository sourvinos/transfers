import { Component, HostListener, Input } from '@angular/core'
import { IndexInteractionService } from '../../services/index-interaction.service'

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css']
})

export class TableComponent {

    @Input() records: any[]

    @Input() headers: any
    @Input() widths: any
    @Input() visibility: any
    @Input() justify: any
    @Input() fields: any

    currentRow: number = 0
    rowCount: number = 0

    indexContent: any
    table: any
    rowHeaderHeight: any
    rowHeight: number = 0

    constructor(private indexInteractionService: IndexInteractionService) { }

    ngAfterViewInit() {
        setTimeout(() => {
            this.calculateDimensions()
            this.rowCount = this.table.rows.length - 1
            document.getElementById('table-input').focus()
            this.gotoRow('1')
        }, 100)
    }

    @HostListener('keyup', ['$event']) onkeyup(event: { key: string; target: { getAttribute: { (arg0: string): void; (arg0: string): void } } }) {
        this.gotoRow(event.key)
    }

    private clearAllRowHighlights() {
        this.table.querySelectorAll('tr').forEach((element: { classList: { remove: (arg0: string) => void } }) => {
            element.classList.remove('selected')
        })
    }

    private gotoRow(key: string) {
        if (!isNaN(parseInt(key))) {
            this.clearAllRowHighlights()
            this.highlightRow(this.table, key)
            this.sendRowToService()
        }
        if (key == 'Enter') {
            this.sendRowToService(true)
        }
        if (key == 'ArrowUp' && this.currentRow > 1) {
            this.clearAllRowHighlights()
            this.highlightRow(this.table, 'up')
            this.sendRowToService()
            if (!this.isRowIntoView(this.table.rows[this.currentRow], key)) {
                document.getElementById(this.currentRow.toString()).scrollIntoView()
                this.indexContent.scrollTop = (this.currentRow - 1) * this.rowHeight
            }
        }
        if (key == 'ArrowDown' && this.currentRow < this.rowCount) {
            this.clearAllRowHighlights()
            this.highlightRow(this.table, 'down')
            this.sendRowToService()
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

    private calculateDimensions() {
        this.indexContent = document.getElementById('index-table').parentNode.parentNode
        this.table = document.getElementById('index-table')
        this.rowHeaderHeight = document.querySelector('thead')
        this.rowHeight = this.table.rows[1].offsetHeight
        if (this.indexContent.scrollHeight <= this.indexContent.offsetHeight) {
            this.indexContent.style.overflowY = 'hidden'
            this.table.style.marginRight = '0px'
        }
    }

    private sendRowToService(dialogMustClose?: boolean) {
        this.indexInteractionService.sendObject([this.records[this.currentRow - 1], dialogMustClose])
    }

}
