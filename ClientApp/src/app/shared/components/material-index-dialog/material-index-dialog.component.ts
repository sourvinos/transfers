import { SelectionModel } from '@angular/cdk/collections';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-material-index-dialog',
    templateUrl: './material-index-dialog.component.html',
    styleUrls: ['./material-index-dialog.component.css']
})

export class MaterialIndexDialogComponent implements OnInit {

    constructor(private dialogRef: MatDialogRef<MaterialIndexDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    dataSource: MatTableDataSource<[]>;
    selection: SelectionModel<[]>;

    header = ''
    columns = []
    fields = []
    align = []
    format = []
    selectedElement = []

    @HostListener('document:keydown', ['$event']) anyEvent(event: { altKey: any; shiftKey: any; key: { toUpperCase: { (): string; (): string; (): string; (): string; (): string; }; }; }) {
        if (event.key == 'Enter') {
            this.getCurrentRow()
            this.dialogRef.close(this.selectedElement)
        }
    }

    ngOnInit() {
        this.header = this.data.header
        this.columns = this.data.columns
        this.fields = this.data.fields
        this.align = this.data.align
        this.format = this.data.format
        this.dataSource = new MatTableDataSource<[]>(this.data.records);
        this.selection = new SelectionModel<[]>(false);
    }

    // T
    close() {
        this.getCurrentRow()
        this.dialogRef.close(this.selectedElement)
    }

    private getCurrentRow() {
        for (let index = 0; index < this.columns.length; index++) {
            this.selectedElement[index] = document.querySelector('.mat-row.selected').children[index].textContent.trimRight()
        }
        return this.selectedElement
    }

}
