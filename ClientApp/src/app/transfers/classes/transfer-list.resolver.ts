import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { TransferService } from './transfer.service';
import { TransferViewModel } from './transferViewModel';

@Injectable({ providedIn: 'root' })

export class TransferListResolver implements Resolve<TransferViewModel> {

    dateIn: string

    constructor(private transferService: TransferService) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.transferService.getTransfers(route.params.dateIn)
    }

}
