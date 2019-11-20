import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { IQueryResult } from '../../models/queryResult';
import { TransferService } from './service-transfer';

@Injectable({ providedIn: 'root' })

export class TransferListResolverService implements Resolve<IQueryResult[]>{

    dateIn: string

    constructor(private transferService: TransferService, private route: ActivatedRoute) {
        this.route.params.subscribe(p => (this.dateIn = p['date']))
    }

    resolve(route: ActivatedRouteSnapshot): Observable<IQueryResult[]> {
        return this.transferService.getTransfers(route.params.date)
    }

}