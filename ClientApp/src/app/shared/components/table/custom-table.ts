import { AfterViewInit, Component, Input, IterableDiffer, IterableDiffers, OnDestroy, OnInit } from '@angular/core'
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service'
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service'
import { IndexInteractionService } from '../../services/index-interaction.service'

@Component({
    selector: 'custom-table',
    templateUrl: './custom-table.html',
    styleUrls: ['./custom-table.css']
})

export class CustomTableComponent implements OnInit, AfterViewInit {

    @Input() records: any[]
    @Input() headers: any
    @Input() widths: any
    @Input() visibility: any
    @Input() justify: any
    @Input() fields: any
    currentRow = 0
    tableContainer: any
    customTable: any
    rowHeight = 0
    rowCount = 0
    sortOrder = 'desc'

    differences: IterableDiffer<any>;

    unlisten: Unlisten

    constructor(private baseInteractionService: BaseInteractionService, private indexInteractionService: IndexInteractionService, private iterableDiffers: IterableDiffers, private keyboardShortcutsService: KeyboardShortcuts) { }

    ngOnInit() {
        this.differences = this.iterableDiffers.find(this.records).create();
    }

    ngAfterViewInit() {
        this.initVariables()
        this.gotoRow(1)
    }

    onDomChange($event: Event) {
        this.gotoRow(1)
    }
    checkKeyboard(event: any) {
        switch (event.keyCode) {
            case 38: this.gotoRow('Up'); break;
            case 40: this.gotoRow('Down'); break;
            case 13: this.sendRowToService(); break;
            default: break;
        }
    }

    sortMe(columnName: string, sortOrder: string) {
        this.records.sort(this.compareValues(columnName, sortOrder))
        this.sortOrder = this.sortOrder === 'asc' ? this.sortOrder = 'desc' : this.sortOrder = 'asc'
    }

    private gotoRow(key: any) {
        if (!isNaN(key)) {
            this.unselectAllRows().then(() => {
                this.selectRow(this.customTable, key)
                this.sendRowToIndexService()
            })
        }
        if (key === 'Up' && this.currentRow > 1) {
            this.unselectRow()
            this.selectRow(this.customTable, 'up')
            this.sendRowToIndexService()
            if (!this.isRowIntoView(this.customTable.rows[this.currentRow], key)) {
                this.tableContainer.scrollTop = (this.currentRow - 1) * this.rowHeight
            }
        }
        if (key === 'Down' && this.currentRow < this.rowCount) {
            this.unselectRow()
            this.selectRow(this.customTable, 'down')
            this.sendRowToIndexService()
            if (!this.isRowIntoView(this.customTable.rows[this.currentRow], key)) {
                document.getElementById('line-' + this.currentRow.toString()).scrollIntoView({ block: 'end' })
            }
        }
    }

    private initVariables() {
        this.customTable = document.getElementById('custom-table')
        this.tableContainer = this.customTable.parentNode.parentNode
        this.rowHeight = this.customTable.rows[1].offsetHeight
        this.rowCount = this.customTable.rows.length - 1
    }

    private isRowIntoView(row: HTMLTableRowElement, direction: string) {
        const rowOffsetTop = row.offsetTop
        const scrollTop = this.tableContainer.scrollTop
        const rowTopPlusHeight = rowOffsetTop + row.offsetHeight
        const indexTopPlusHeight = scrollTop + this.tableContainer.offsetHeight
        if (direction === 'Up') {
            if (indexTopPlusHeight - rowOffsetTop + this.rowHeight < this.tableContainer.offsetHeight) {
                return true
            } else {
                return false
            }
        }
        if (direction === 'Down') {
            if (rowTopPlusHeight <= indexTopPlusHeight) {
                return true
            } else {
                return false
            }
        }
    }

    private selectRow(table: HTMLTableElement, direction: any) {
        if (!isNaN(direction)) {
            this.currentRow = parseInt(direction, 10)
        } else {
            if (direction === 'up') { this.currentRow-- }
            if (direction === 'down') { ++this.currentRow }
        }
        document.getElementById('custom-table-input').focus()
        table.rows[this.currentRow].classList.add('selected')
    }

    private sendRowToService() {
        if (document.getElementsByClassName('mat-dialog-container').length === 0) {
            this.sendRowToBaseService()
        } else {
            this.indexInteractionService.action(true)
        }
    }

    private sendRowToBaseService() {
        this.baseInteractionService.sendObject(this.records[this.currentRow - 1])
    }

    private sendRowToIndexService() {
        this.indexInteractionService.sendObject(this.records[this.currentRow - 1])
    }

    private async unselectAllRows() {
        await this.customTable.querySelectorAll('tr').forEach((element: { classList: { remove: (arg0: string) => void } }) => {
            element.classList.remove('selected')
        })
    }

    private unselectRow() {
        this.customTable.rows[this.currentRow].classList.remove('selected')
    }

    private compareValues(key: string, order = 'asc') {
        return function innerSort(a: { [x: string]: any; hasOwnProperty: (arg0: string) => any }, b: { [x: string]: any; hasOwnProperty: (arg0: string) => any }) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) { return 0 }
            let comparison = 0
            const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key]
            const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key]
            comparison = varA > varB ? 1 : -1
            return ((order === 'desc') ? (comparison * -1) : comparison)
        }
    }

}
