import { PipeTransform, Pipe } from '@angular/core';
import * as moment from 'moment'

@Pipe({ name: 'custom' })

export class CustomPipe implements PipeTransform {
    transform(value: any, format: any) {
        switch (format) {
            case 'date':
                return moment(value).format('DD/MM/YYYY')
            case 'integer':
                return new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(value)
            case 'decimal':
                return new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(value)
            default:
                return value
        }
    }
}