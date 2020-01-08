import { Component, HostListener, Input, IterableChanges, IterableDiffer, IterableDiffers } from '@angular/core'
import { InteractionTransferService } from '../classes/service-interaction-transfer'

@Component({
    selector: 'table-transfer',
    templateUrl: './table-transfer.html',
    styleUrls: ['./table-transfer.css']
})

export class TableTransferComponent {

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
    checked: boolean = false
    checkedIds: string[] = []
    totalPersons: number = 0

    differences: IterableDiffer<any>;

    // #endregion

    constructor(private transferInteractionService: InteractionTransferService, private iterableDiffers: IterableDiffers) { }

    @HostListener('keyup', ['$event']) onkeyup(event: { key: string; target: { getAttribute: { (arg0: string): void; (arg0: string): void } } }) {
        if (event.key == 'Enter') this.sendRowToService()
        if (event.key == 'ArrowUp' || event.key == 'ArrowDown') this.gotoRow(event.key)
    }

    ngOnInit() {
        this.differences = this.iterableDiffers.find(this.records).create();
    }

    ngAfterViewInit() {
        this.initVariables()
    }

    public ngDoCheck() {
        const changes: IterableChanges<any> = this.differences.diff(this.records);
        if (changes) this.checked = false
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

    toggleCheckBox(row: number) {
        this.checkedIds = []
        this.totalPersons = 0
        this.table.rows[row].classList.toggle('checked')
        this.table.querySelectorAll('tr.checked').forEach((element: { childNodes: { innerText: string }[] }) => {
            this.checkedIds.push(element.childNodes[2].innerText)
            this.totalPersons += parseInt(element.childNodes[11].innerText)
        })
        localStorage.setItem('selectedIds', JSON.stringify(this.checkedIds))
        this.transferInteractionService.setCheckedTotalPersons(this.totalPersons)
    }

    onHeaderClick(column: any) {
        if (column.toElement.cellIndex == 0) {
            this.checked = !this.checked
            this.checkedIds = []
            this.totalPersons = 0
            this.table.querySelectorAll('tbody tr').forEach((element: { classList: { add: (arg0: string) => void; remove: (arg0: string) => void }; childNodes: { innerText: string }[] }) => {
                if (this.checked) {
                    element.classList.add('checked')
                    this.checkedIds.push(element.childNodes[2].innerText)
                    this.totalPersons += parseInt(element.childNodes[11].innerText)
                }
                else {
                    element.classList.remove('checked')
                }
            })
            localStorage.setItem('selectedIds', JSON.stringify(this.checkedIds))
            this.transferInteractionService.setCheckedTotalPersons(this.totalPersons)
        }
    }

}
