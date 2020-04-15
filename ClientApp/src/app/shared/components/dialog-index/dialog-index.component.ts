import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IndexInteractionService } from '../../services/index-interaction.service';

@Component({
    selector: 'dialog-index',
    templateUrl: './dialog-index.component.html',
    styleUrls: ['../../styles/dialogs.css']
})

export class DialogIndexComponent implements OnInit, OnDestroy {

    title: string

    fields: any[]
    headers: any[]
    justify: any[]
    visibility: any[]
    widths: any[]
    records: any[]
    selectedRecord: any
    ngUnsubscribe = new Subject<void>();

    constructor(public dialogRef: MatDialogRef<DialogIndexComponent>, private indexInteractionService: IndexInteractionService, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.title = data.title
        this.fields = data.fields
        this.headers = data.headers
        this.justify = data.justify
        this.visibility = data.visibility
        this.widths = data.widths
        this.records = data.records
    }

    ngOnInit() {
        this.subscribeToIndexinteractionService()
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.unsubscribe();
    }

    private subscribeToIndexinteractionService() {
        this.indexInteractionService.data.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            this.selectedRecord = response
            this.indexInteractionService.dialogMustClose.subscribe(x => {
                if (x) {
                    this.dialogRef.close(this.selectedRecord);
                }
            })
        })
    }

}
