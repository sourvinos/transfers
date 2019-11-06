import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ITaxOffice } from '../models/taxOffice';
import { TaxOfficeService } from '../services/taxOffice.service';

@Injectable({ providedIn: 'root' })

export class TaxOfficeListResolverService implements Resolve<ITaxOffice[]>{

    constructor(private taxOfficeService: TaxOfficeService) { }

    resolve(): Observable<ITaxOffice[]> {
        return this.taxOfficeService.getTaxOffices().pipe(delay(100))
    }

}