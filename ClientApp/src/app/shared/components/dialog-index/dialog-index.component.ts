import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IndexInteractionService } from '../../services/index-interaction.service';

@Component({
	selector: 'dialog-index',
	templateUrl: './dialog-index.component.html',
	styleUrls: ['./dialog-index.component.css']
})

export class DialogIndexComponent implements OnInit, AfterViewInit, OnDestroy {

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
		this.subscribeToIndexInderactionService()
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this.calculateDimensions()
		}, 100)
	}

	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.unsubscribe();
	}

	private calculateDimensions() {
		document.getElementById('index-dialog-footer').style.paddingRight =
			document.getElementById('index-dialog').offsetWidth -
			document.getElementById('table-index').offsetWidth - 20 + 'px'
	}

	private subscribeToIndexInderactionService() {
		this.indexInteractionService.data.pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
			this.selectedRecord = response[0]
			if (response[1] != null) {
				this.dialogRef.close(this.selectedRecord = response[0]);
			}
		})
	}

}