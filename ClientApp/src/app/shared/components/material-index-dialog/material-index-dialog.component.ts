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

    columns = []
    selectedElement = []

    @HostListener('document:keydown', ['$event']) anyEvent(event: { altKey: any; shiftKey: any; key: { toUpperCase: { (): string; (): string; (): string; (): string; (): string; }; }; }) {
        if (event.key == 'Enter') {
            this.getCurrentRow()
            this.dialogRef.close(this.selectedElement)
        }
    }

    ngOnInit() {
        this.columns = this.data.headers
        this.dataSource = new MatTableDataSource<[]>(this.data.records);
        this.selection = new SelectionModel<[]>(false);
    }

    close() {
        this.getCurrentRow()
        this.dialogRef.close(this.selectedElement)
    }

    private getCurrentRow() {
        for (let index = 0; index < this.columns.length; index++) {
            this.selectedElement[index] = document.querySelector('tr.selected').children[index].textContent
        }
    }

}
