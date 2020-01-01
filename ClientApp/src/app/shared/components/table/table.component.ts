import { Component, HostListener, Input } from '@angular/core'
import { IndexInteractionService } from '../../services/index-interaction.service'

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css']
})

export class TableComponent {

    // #region Variables

    @Input() records: any[]

    @Input() headers: any
    @Input() widths: any
    @Input() visibility: any
    @Input() justify: any
    @Input() fields: any

    currentRow: number = 0
    tableContainer: any
    table: any
    rowHeight: number = 0
    rowCount: number = 0

    // #endregion

    constructor(private indexInteractionService: IndexInteractionService) { }

    ngAfterViewInit() {
        this.initVariables()
        // this.gotoRow(1)
    }

    @HostListener('keyup', ['$event']) onkeyup(event: { key: string; altKey: any }) {
        if (event.key == 'Enter' || (event.altKey && event.key.toUpperCase() == 'S')) this.indexInteractionService.action(true)
        if (event.key == 'ArrowUp' || event.key == 'ArrowDown') this.gotoRow(event.key)
    }

    private gotoRow(key: any) {
        if (!isNaN(key)) {
            this.unselectRows()
            this.selectRow(this.table, key)
            this.sendRowToService()
        }
        if (key == 'ArrowUp' && this.currentRow > 1) {
            this.unselectRow()
            this.selectRow(this.table, 'up')
            this.sendRowToService()
            if (!this.isRowIntoView(this.table.rows[this.currentRow], key)) {
                this.tableContainer.scrollTop = (this.currentRow - 1) * this.rowHeight
            }
        }
        if (key == 'ArrowDown' && this.currentRow < this.rowCount) {
            this.unselectRow()
            this.selectRow(this.table, 'down')
            this.sendRowToService()
            if (!this.isRowIntoView(this.table.rows[this.currentRow], key)) {
                document.getElementById("index-" + this.currentRow.toString()).scrollIntoView({ block: "end" })
            }
        }
    }

    private initVariables() {
        this.table = document.getElementById('table-index')
        this.tableContainer = this.table.parentNode.parentNode
        this.rowHeight = 51
        this.rowCount = this.table.rows.length - 1
    }

    private isRowIntoView(row: HTMLTableRowElement, direction: string) {
        const rowOffsetTop = row.offsetTop
        const indexContentScrollTop = this.tableContainer.scrollTop
        const rowOffetTopPlusRowOffsetHeight = rowOffsetTop + row.offsetHeight
        const indexContentScrollTopPuslIndexContentOffsetHeight = indexContentScrollTop + this.tableContainer.offsetHeight
        if (direction == 'ArrowUp') {
            if (indexContentScrollTopPuslIndexContentOffsetHeight - rowOffsetTop + this.rowHeight < this.tableContainer.offsetHeight) {
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

    private selectRow(table: HTMLTableElement, direction: any) {
        if (!isNaN(direction)) {
            this.currentRow = parseInt(direction)
            document.getElementById('table-index-input').focus()
        } else {
            if (direction == 'up') this.currentRow--
            if (direction == 'down')++this.currentRow
        }
        table.rows[this.currentRow].classList.add('selected')
    }

    private sendRowToService() {
        this.indexInteractionService.sendObject(this.records[this.currentRow - 1])
    }

    private unselectRow() {
        this.table.rows[this.currentRow].classList.remove('selected')
    }

    private unselectRows() {
        this.table.querySelectorAll('tr').forEach((element: { classList: { remove: (arg0: string) => void } }) => {
            element.classList.remove('selected')
        })
    }

}
