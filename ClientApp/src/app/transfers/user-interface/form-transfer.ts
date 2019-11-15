import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ITransfer } from '../classes/model-transfer';
import { TransferService } from './../classes/service-transfer';
import { ModalTransferFormComponent } from './modal-form';

@Component({
    selector: 'app-transfer-form',
    templateUrl: './form-transfer.html',
    styleUrls: ['./form-transfer.css']
})

export class TransferFormComponent {

    transferId: number
    transfer: ITransfer

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private transferService: TransferService, public dialog: MatDialog) {
        this.activatedRoute.params.subscribe((params: Params) => {
            console.log(params)
            this.getTransfer(params)
        })
    }

    // T
    goBack() {
        this.router.navigate(['../../'], {
            relativeTo: this.activatedRoute
        })
    }

    // T
    save(object: ITransfer) {
        this.transferService.updateTransfer(this.transferId, object).subscribe(() => {
            this.router.navigate(['../../'], {
                relativeTo: this.activatedRoute
            })
        })
    }

    private getTransfer(params: { [x: string]: any; }) {
        this.transferService.getTransfer(params['transferId']).subscribe(result => {
            this.transfer = result
            const dialogRef = this.dialog.open(ModalTransferFormComponent, {
                width: '700px',
                data: { transfer: this.transfer },
                closeOnNavigation: false
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.save(result)
                } else {
                    this.router.navigate(['../../'], {
                        relativeTo: this.activatedRoute
                    })
                }
            });
        })
    }

}
