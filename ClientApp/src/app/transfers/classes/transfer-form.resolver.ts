import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Transfer } from './transfer';
import { TransferService } from './transfer.service';

@Injectable({ providedIn: 'root' })

export class TransferFormResolver implements Resolve<Transfer> {

    constructor(private transferService: TransferService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Transfer> {
        return this.transferService.getSingle(route.params.id)
    }

}
