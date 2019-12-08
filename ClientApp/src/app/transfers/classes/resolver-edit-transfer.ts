import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ITransfer } from './model-transfer';
import { TransferService } from './service-api-transfer';

@Injectable({ providedIn: 'root' })

export class TransferEditResolverService implements Resolve<ITransfer>{

    constructor(private transferService: TransferService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<ITransfer> {
        return this.transferService.getTransfer(route.params.transferId)
    }

}