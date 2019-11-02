import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { KeyboardShortcuts, Unlisten } from 'src/app/services/keyboard-shortcuts.service';

@Component({
    selector: 'app-material-dialog',
    templateUrl: './material-dialog.component.html',
    styleUrls: ['./material-dialog.component.css']
})

export class MaterialDialogComponent {

    constructor(private dialogRef: MatDialogRef<MaterialDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private keyboardShortcutsService: KeyboardShortcuts) { }

    close() {
        this.dialogRef.close()
    }

}
