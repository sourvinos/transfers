import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { IQueryResult } from '../../models/queryResult';
import { TransferService } from './service-api-transfer';

@Injectable({ providedIn: 'root' })

export class TransferListResolverService implements Resolve<IQueryResult[]>{

    dateIn: string

    constructor(private transferService: TransferService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<IQueryResult[]> {
        console.log('Resolver')
        return this.transferService.getTransfers(route.params.dateIn)
    }

}