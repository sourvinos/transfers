import { Component, Input, IterableDiffer, IterableDiffers } from '@angular/core'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
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
    customTable: any
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
        this.gotoRow(1)
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
     *  Class - ngAfterViewInit()
     *  Class - onDomChange()
     *  Class - addShortcuts()
     * 
     * Description:
     *  Highlights the next / previous row according to the arrow keys or highlights the clicked row
     * 
     * @param key // The pressed key code or the line number to go to directly
     */
    private gotoRow(key: any) {
        if (!isNaN(key)) {
            this.unselectAllRows().then(() => {
                this.selectRow(this.customTable, key)
                this.sendRowToIndexService()
            })
        }
        if (key == 'Up' && this.currentRow > 1) {
            this.unselectRow()
            this.selectRow(this.customTable, 'up')
            this.sendRowToIndexService()
            if (!this.isRowIntoView(this.customTable.rows[this.currentRow], key)) {
                this.tableContainer.scrollTop = (this.currentRow - 1) * this.rowHeight
            }
        }
        if (key == 'Down' && this.currentRow < this.rowCount) {
            this.unselectRow()
            this.selectRow(this.customTable, 'down')
            this.sendRowToIndexService()
            if (!this.isRowIntoView(this.customTable.rows[this.currentRow], key)) {
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
        this.customTable = document.getElementById('custom-table')
        this.tableContainer = this.customTable.parentNode.parentNode
        this.rowHeight = 51
        this.rowCount = this.customTable.rows.length - 1
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
        if (direction == 'Up') {
            if (indexTopPlusHeight - rowOffsetTop + this.rowHeight < this.tableContainer.offsetHeight) {
                return true
            } else {
                return false
            }
        }
        if (direction == 'Down') {
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
        } else {
            if (direction == 'up') this.currentRow--
            if (direction == 'down')++this.currentRow
        }
        document.getElementById('custom-table-input').focus()
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
     *  Class - sendRowToService()
     * 
     * Description:
     *  Sends the selected row to the service so that the parent (list) can call the editRecord method
     */
    private sendRowToBaseService() {
        this.baseInteractionService.sendObject(this.records[this.currentRow - 1])
    }

    /**
     * Caller(s):
     *  Class - gotoRow()
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
    private async unselectAllRows() {
        await this.customTable.querySelectorAll('tr').forEach((element: { classList: { remove: (arg0: string) => void } }) => {
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
        this.customTable.rows[this.currentRow].classList.remove('selected')
    }

}
