import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { TransferService } from './service-api-transfer';
import { QueryResult } from './model-viewModel-transfer';

@Injectable({ providedIn: 'root' })

export class TransferListResolverService implements Resolve<QueryResult[]>{

    dateIn: string

    constructor(private transferService: TransferService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<QueryResult[]> {
        return this.transferService.getTransfers(route.params.dateIn)
    }

}