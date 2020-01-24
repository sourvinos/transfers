import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Transfer } from './model-transfer';
import { TransferService } from './service-api-transfer';

@Injectable({ providedIn: 'root' })

export class TransferEditResolverService implements Resolve<Transfer>{

    constructor(private transferService: TransferService) { }

    resolve(route: ActivatedRouteSnapshot): Promise<Transfer> {
        return this.transferService.getSingle(route.params.transferId)
    }

}