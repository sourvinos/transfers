import { AfterViewInit, Component, HostListener, Input } from '@angular/core'
import { InteractionTransferService } from '../classes/service-interaction-transfer'

@Component({
    selector: 'table-transfer',
    templateUrl: './table-transfer.html',
    styleUrls: ['./table-transfer.css']
})

export class TableTransferComponent implements AfterViewInit {

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
    checkedIds: string[]

    // #endregion

    constructor(private transferInteractionService: InteractionTransferService) { }

    @HostListener('keyup', ['$event']) onkeyup(event: { key: string; target: { getAttribute: { (arg0: string): void; (arg0: string): void } } }) {
        if (event.key == 'Enter') this.sendRowToService()
        if (event.key == 'ArrowUp' || event.key == 'ArrowDown') this.gotoRow(event.key)
    }

    ngAfterViewInit() {
        this.initVariables()
    }

    /**
     * Caller(s):
     *  Template - table
     * 
     * Description:
     *  Uses the DomChangeDirective to listen for DOM changes
     * 
     * @param $event 
     */
    onDomChange($event: Event) {
        document.getElementById('table-transfer-input').focus()
        this.gotoRow(1)
    }

    /**
     * Caller(s):
     *  Class - HostListener()
     *  Class - onDomChange()
     *  Template - gotoRow()
     * 
     * Description:
     *  Highlights the next / previous row according to the arrow keys or highlights the clicked row
     * 
     * @param key // The pressed key code or the number of the line to goto directly after a mouse click / set from code
     */
    private gotoRow(key: any) {
        if (!isNaN(key)) {
            this.unselectAllRows()
            this.selectRow(this.table, key)
        }
        if (key == 'ArrowUp' && this.currentRow > 1) {
            this.unselectRow()
            this.selectRow(this.table, 'up')
            if (!this.isRowIntoView(this.table.rows[this.currentRow], key)) {
                this.tableContainer.scrollTop = (this.currentRow - 1) * this.rowHeight
            }
        }
        if (key == 'ArrowDown' && this.currentRow < this.rowCount) {
            this.unselectRow()
            this.selectRow(this.table, 'down')
            if (!this.isRowIntoView(this.table.rows[this.currentRow], key)) {
                document.getElementById("transfer-" + this.currentRow.toString()).scrollIntoView({ block: "end" })
            }
        }
    }

    /**
     * Caller(s):
     *  Class - ngAfterViewInit()
     * 
     * Description:
     *  Initializes local variables
     */
    private initVariables() {
        this.table = document.getElementById('table-transfer')
        this.tableContainer = this.table.parentNode.parentNode
        this.rowHeight = 51
        this.rowCount = this.table.rows.length - 1
    }

    /**
     * Caller(s):
     *  Class - gotoRow()
     * 
     * Description:
     *  Checks if the selected row is fully visible
     * 
     * @param row 
     * @param direction 
     */
    private isRowIntoView(row: HTMLTableRowElement, direction: string) {
        const rowOffsetTop = row.offsetTop
        const scrollTop = this.tableContainer.scrollTop
        const rowTopPlusHeight = rowOffsetTop + row.offsetHeight
        const indexTopPlusHeight = scrollTop + this.tableContainer.offsetHeight
        if (direction == 'ArrowUp') {
            if (indexTopPlusHeight - rowOffsetTop + this.rowHeight < this.tableContainer.offsetHeight) {
                return true
            } else {
                return false
            }
        }
        if (direction == 'ArrowDown') {
            if (rowTopPlusHeight <= indexTopPlusHeight) {
                return true
            } else {
                return false
            }
        }
    }

    /**
     * Caller(s):
     *  Class - gotoRow()
     * 
     * Description:
     *  Updates the currentRow variable and highlights
     * 
     * @param table 
     * @param direction 
     */
    private selectRow(table: HTMLTableElement, direction: any) {
        if (!isNaN(direction)) {
            this.currentRow = parseInt(direction)
            document.getElementById('table-transfer-input').focus()
        } else {
            if (direction == 'up') this.currentRow--
            if (direction == 'down')++this.currentRow
        }
        table.rows[this.currentRow].classList.add('selected')
    }

    /**
     * Caller(s):
     *  Class - HostListener()
     * 
     * Description:
     *  Sends the selected row to the service so that the parent (list-transfer) can call the editRecord method
     */
    private sendRowToService() {
        this.transferInteractionService.sendObject(this.records[this.currentRow - 1])
    }

    /**
     * Caller(s):
     *  Class - gotoRow()
     * 
     * Description:
     *  Removes the 'selected' class from all the rows
     */
    private unselectAllRows() {
        this.table.querySelectorAll('tr').forEach((element: { classList: { remove: (arg0: string) => void } }) => {
            element.classList.remove('selected')
        })
    }

    /**
     * Caller(s):
     *  Class - gotoRow()
     * 
     * Description:
     *  Removes the 'selected' class from the current row
     */
    private unselectRow() {
        this.table.rows[this.currentRow].classList.remove('selected')
    }

    /**
     * Caller(s):
     *  Template - toggleChecked()
     * 
     * Description:
     *  Toggles the class 'checked' for the first column - will be used to assign a driver for the 'checked' rows
     */
    toggleChecked() {
        this.checkedIds = []
        this.table.querySelectorAll('tr').forEach((element: { classList: { toggle: (arg0: string) => void } }) => {
            element.classList.toggle('checked')
        })
        this.table.querySelectorAll('tr.checked td:nth-child(2)').forEach((element: { textContent: string }) => {
            this.checkedIds.push(element.textContent)
        })
        console.log(this.checkedIds)
        localStorage.setItem('selectedIds', JSON.stringify(this.checkedIds))
    }

}
