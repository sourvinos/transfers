import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ITaxOffice } from '../models/taxOffice';
import { VatStateService } from '../services/vatState.service';
import { IVatState } from '../models/vatState';

@Injectable({ providedIn: 'root' })

export class VatStateListResolverService implements Resolve<IVatState[]>{

    constructor(private vatStateService: VatStateService) { }

    resolve(): Observable<ITaxOffice[]> {
        return this.vatStateService.getVatStates().pipe(delay(100))
    }

}