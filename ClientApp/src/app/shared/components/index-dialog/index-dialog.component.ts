import { InteractionService } from './../../services/interaction.service';
import { Component, EventEmitter, HostListener, Inject, Output } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
	selector: 'index-dialog',
	templateUrl: './index-dialog.component.html',
	styleUrls: ['./index-dialog.component.css']
})

export class IndexDialogComponent {

	title: string

	fields: any[]
	headers: any[]
	justify: any[]
	visibility: any[]
	widths: any[]

	records: any[]

	selectedRecord: any

	constructor(private interactionService: InteractionService, @Inject(MAT_DIALOG_DATA) public data: any) {
		this.title = data.title
		this.fields = data.fields
		this.headers = data.headers
		this.justify = data.justify
		this.visibility = data.visibility
		this.widths = data.widths
		this.records = data.records
	}

	ngOnInit() {
		this.interactionService.data.subscribe(response => {
			this.selectedRecord = response
		})
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this.calculateDimensions()
		}, 100)
	}

	private calculateDimensions() {
		document.getElementById('index-dialog-footer').style.paddingRight =
			document.getElementById('index-dialog').offsetWidth -
			document.getElementById('index-table').offsetWidth - 20 + 'px'
	}

}