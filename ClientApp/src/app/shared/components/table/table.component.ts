import { AfterViewInit, Component, HostListener, Input } from '@angular/core';
import { Unlisten } from 'src/app/services/keyboard-shortcuts.service';
import { InteractionService } from './../../services/interaction.service';

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

    currentRow: number = 0

    indexContent: any
    table: any
    rowHeight: number = 0

    unlisten: Unlisten

    // #endregion

    constructor(private interactionService: InteractionService) { }

    @HostListener('document:keydown', ['$event']) anyEvent(event: { key: string }) {
        if (event.key == 'Enter') {
            this.interactionService.sendObject(this.records[this.currentRow - 1])
        } else {
            this.gotoRow(event.key)
        }
    }

    ngAfterViewInit() {
        this.calculateDimensions()
        this.gotoRow('1')
    }

    gotoRow(position: string) {
        if (!isNaN(parseInt(position))) {
            this.clearAllRowHighlights()
            this.highlightRow(this.table, position)
            this.indexContent.scrollTop = (this.currentRow - 1) * this.rowHeight - 0
        }
        if (position == 'ArrowUp' && this.currentRow > 1) {
            this.clearAllRowHighlights()
            this.highlightRow(this.table, 'up')
            if (!this.isRowIntoView(this.table.rows[this.currentRow], position)) {
                document.getElementById(this.currentRow.toString()).scrollIntoView()
                this.indexContent.scrollTop = (this.currentRow - 1) * this.rowHeight - 0
            }
        }
        if (position == 'ArrowDown' && this.currentRow < this.table.rows.length - 1) {
            this.clearAllRowHighlights()
            this.highlightRow(this.table, 'down')
            if (!this.isRowIntoView(this.table.rows[this.currentRow], position)) {
                document.getElementById(this.currentRow.toString()).scrollIntoView(false)
            }
        }
    }

    private calculateDimensions() {
        this.indexContent = document.getElementById('index-table').parentNode.parentNode
        this.table = document.getElementById('index-table')
        this.rowHeight = this.table.rows[1].offsetHeight
        if (this.indexContent.scrollHeight <= this.indexContent.offsetHeight) {
            this.indexContent.style.overflowY = 'hidden'
            this.table.style.marginRight = '0px'
        }
    }

    private clearAllRowHighlights() {
        this.table.querySelectorAll('tr').forEach((element: { classList: { remove: (arg0: string) => void } }) => {
            element.classList.remove('selected')
        })
    }

    private highlightRow(table: HTMLTableElement, direction: any) {
        if (!isNaN(direction)) {
            this.currentRow = parseInt(direction)
        } else {
            if (direction == 'up')--this.currentRow
            if (direction == 'down')++this.currentRow
        }
        table.rows[this.currentRow].classList.toggle('selected')
    }

    private isRowIntoView(row: HTMLTableRowElement, direction: string) {
        const rowOffsetTop = row.offsetTop;
        const indexContentScrollTop = this.indexContent.scrollTop;
        const rowOffetTopPlusRowOffsetHeight = rowOffsetTop + row.offsetHeight;
        const indexContentScrollTopPuslIndexContentOffsetHeight = indexContentScrollTop + this.indexContent.offsetHeight;
        if (direction == 'ArrowUp') {
            if (indexContentScrollTopPuslIndexContentOffsetHeight - rowOffsetTop + this.rowHeight < this.indexContent.offsetHeight) return true
        }
        if (direction == 'ArrowDown') {
            if (rowOffetTopPlusRowOffsetHeight <= indexContentScrollTopPuslIndexContentOffsetHeight) return true
        }
        return false
    }

}
