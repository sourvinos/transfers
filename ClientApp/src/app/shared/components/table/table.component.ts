import { AfterViewInit, Component, HostListener, Input } from '@angular/core';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css']
})

export class TableComponent implements AfterViewInit {

    @Input() records: any[]

    @Input() headers: any
    @Input() widths: any
    @Input() visibility: any
    @Input() justify: any
    @Input() fields: any

    currentRow: number = 0

    indexContent: any
    table: any
    rowHeaderHeight: any
    rowHeight: number = 0

    constructor() { }

    ngAfterViewInit() {
        setTimeout(() => {
            this.calculateDimensions()
            this.gotoRow('1')
        }, 100)
    }

    @HostListener('document:keydown', ['$event']) anyEvent(event: { key: string }) {
        this.gotoRow(event.key)
    }

    gotoRow(position: string) {
        if (!isNaN(parseInt(position))) {
            console.log('Going to row', position)
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

    private highlightRow(table: HTMLTableElement, direction: any) {
        if (!isNaN(direction)) {
            this.currentRow = parseInt(direction)
            console.log('Highlighting row', this.currentRow)
        } else {
            if (direction == 'up')--this.currentRow
            if (direction == 'down')++this.currentRow
        }
        table.rows[this.currentRow].classList.toggle('selected')
    }

    private clearAllRowHighlights() {
        this.table.querySelectorAll('tr').forEach((element: { classList: { remove: (arg0: string) => void } }) => {
            element.classList.remove('selected')
        })
    }

    private isRowIntoView(row: HTMLTableRowElement, direction: string) {
        const rowOffsetTop = row.offsetTop; //console.log(''); console.log('rowOffsetTop', rowOffsetTop)
        const indexContentScrollTop = this.indexContent.scrollTop; //console.log('docindexContentScrollTopViewTop', indexContentScrollTop)
        const rowOffetTopPlusRowOffsetHeight = rowOffsetTop + row.offsetHeight; //console.log('rowOffetTopPlusRowOffsetHeight', rowOffetTopPlusRowOffsetHeight)
        const indexContentScrollTopPuslIndexContentOffsetHeight = indexContentScrollTop + this.indexContent.offsetHeight; //console.log('indexContentScrollTopPuslIndexContentOffsetHeight', indexContentScrollTopPuslIndexContentOffsetHeight)
        if (direction == 'ArrowUp') {
            if (indexContentScrollTopPuslIndexContentOffsetHeight - rowOffsetTop + this.rowHeight < this.indexContent.offsetHeight) {
                return true
            }
        }
        if (direction == 'ArrowDown') {
            if (rowOffetTopPlusRowOffsetHeight <= indexContentScrollTopPuslIndexContentOffsetHeight) return true
        }
        return false
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

}
