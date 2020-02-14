import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Transfer } from './transfer';
import { TransferService } from './transfer.service';

@Injectable({ providedIn: 'root' })

export class TransferFormResolver implements Resolve<Transfer> {

    constructor(private transferService: TransferService) { }

    resolve(route: ActivatedRouteSnapshot): Promise<Transfer> {
        return this.transferService.getSingle(route.params.transferId)
    }

}
