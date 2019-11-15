import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { TransferService } from './service-transfer';
import { ITransfer } from './model-transfer';

@Injectable({ providedIn: 'root' })

export class TransferEditResolverService implements Resolve<ITransfer>{

    constructor(private transferService: TransferService, private route: ActivatedRoute) { }

    resolve(route: ActivatedRouteSnapshot): Observable<ITransfer> {
        return this.transferService.getTransfer(route.params.transferId)
    }

}