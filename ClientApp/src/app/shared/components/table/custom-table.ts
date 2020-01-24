import { Component, Input, IterableDiffer, IterableDiffers } from '@angular/core'
import { KeyboardShortcuts, Unlisten } from 'src/app/services/keyboard-shortcuts.service'
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service'
import { IndexInteractionService } from '../../services/index-interaction.service'

@Component({
    selector: 'custom-table',
    templateUrl: './custom-table.html',
    styleUrls: ['./custom-table.css']
})

export class CustomTableComponent {

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

    differences: IterableDiffer<any>;

    unlisten: Unlisten

    // #endregion

    constructor(private baseInteractionService: BaseInteractionService, private indexInteractionService: IndexInteractionService, private iterableDiffers: IterableDiffers, private keyboardShortcutsService: KeyboardShortcuts) { }

    ngOnInit() {
        this.differences = this.iterableDiffers.find(this.records).create();
    }

    ngAfterViewInit() {
        this.addShortcuts()
        this.initVariables()
    }

    ngOnDestroy() {
        this.unlisten && this.unlisten()
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
        document.getElementById('table-input').focus()
        this.gotoRow(1)
    }

    /**
     * Caller(s):
     *  Class - ngAfterViewInit()
     * 
     * Description:
     *  Just read me!
     */
    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            "Enter": (event: KeyboardEvent): void => {
                event.preventDefault()
                this.sendRowToService()
            },
            "Up": (event: KeyboardEvent): void => {
                event.preventDefault()
                this.gotoRow('Up')
            },
            "Down": (event: KeyboardEvent): void => {
                event.preventDefault()
                this.gotoRow('Down')
            }
        }, {
            priority: 3,
            inputs: true
        })
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
     * @param key // The pressed key code or the line number to go to directly
     */
    private gotoRow(key: any) {
        if (!isNaN(key)) {
            this.unselectAllRows()
            this.selectRow(this.table, key)
            this.sendRowToIndexService()
        }
        if (key == 'Up' && this.currentRow > 1) {
            this.unselectRow()
            this.selectRow(this.table, 'up')
            this.sendRowToIndexService()
            if (!this.isRowIntoView(this.table.rows[this.currentRow], key)) {
                this.tableContainer.scrollTop = (this.currentRow - 1) * this.rowHeight
            }
        }
        if (key == 'Down' && this.currentRow < this.rowCount) {
            this.unselectRow()
            this.selectRow(this.table, 'down')
            this.sendRowToIndexService()
            if (!this.isRowIntoView(this.table.rows[this.currentRow], key)) {
                document.getElementById("line-" + this.currentRow.toString()).scrollIntoView({ block: "end" })
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
        this.table = document.getElementById('table')
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
            document.getElementById('table-input').focus()
        } else {
            if (direction == 'up') this.currentRow--
            if (direction == 'down')++this.currentRow
        }
        table.rows[this.currentRow].classList.add('selected')
    }

    /**
     * Caller(s):
     *  Class - addShortcuts()
     * 
     * Description:
     *  If the dialog exists, close it
     *  If the dialog does not exist, send the row to the service
     */
    private sendRowToService() {
        if (document.getElementsByClassName('mat-dialog-container').length == 0) {
            this.sendRowToBaseService()
        } else {
            this.indexInteractionService.action(true)
        }
    }

    /**
     * Caller(s):
     *  Class - HostListener()
     * 
     * Description:
     *  Sends the selected row to the service so that the parent (list) can call the editRecord method
     */
    private sendRowToBaseService() {
        this.baseInteractionService.sendObject(this.records[this.currentRow - 1])
    }

    /**
     * Caller(s):
     *  Class - addShortcuts()
     * 
     * Description:
     *  On every arrow press, send the row to the service
     */
    private sendRowToIndexService() {
        this.indexInteractionService.sendObject(this.records[this.currentRow - 1])
    }

    /**
     * Caller(s):
     *  Class - gotoRow()
     * 
     * Description:
     *  Removes the 'selected' class from all rows
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

}
