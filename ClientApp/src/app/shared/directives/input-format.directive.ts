import * as moment from 'moment'
import { Directive, HostListener, ElementRef, Input } from '@angular/core'

@Directive({ selector: '[inputFormat]' })

export class InputFormatDirective {

    @Input('inputFormat') format: string

    constructor(private el: ElementRef) { }

    @HostListener('click', ['$event.target']) onClick() {
        this.el.nativeElement.select()
    }

    @HostListener('blur') onBlur() {
        if (this.format === 'date') {
            this.el.nativeElement.value = this.formatDate(this.el.nativeElement.value)
        }
    }

    @HostListener('keyup', ['$event']) onkeyup(event: { key: string; target: { getAttribute: { (arg0: string): void; (arg0: string): void } } }) {
        if (this.format === 'date') {
            let value: string = this.el.nativeElement.value
            value = value.replace(/[-,.]/g, '/').replace(/[^0-9/]/g, '')
            if (event.key === 'Enter') {
                value = this.formatDate(value)
            }
            this.el.nativeElement.value = value
        }
    }

    private formatDate(value: string) {
        let day: number
        let month: number
        let year: number
        let newDate: moment.Moment
        let seperatorCount = 0
        let position = value.indexOf('/')
        while (position !== -1) {
            seperatorCount++
            position = value.indexOf('/', position + 1)
        }
        if (value) {
            switch (seperatorCount) {
                case 0:
                    day = parseInt(value.split('/')[0], 10) < 32 ? parseInt(value.split('/')[0], 10) : 0
                    month = parseInt(moment().format('MM'), 10)
                    year = parseInt(moment().format('YYYY'), 10)
                    newDate = moment(day + '-' + month + '-' + year, 'DD/MM/YYYY')
                    return newDate.isValid() ? newDate.format('DD/MM/YYYY') : ''
                case 1:
                    day = parseInt(value.split('/')[0], 10) < 32 ? parseInt(value.split('/')[0], 10) : 0
                    month = parseInt(value.split('/')[1], 10)
                    year = parseInt(moment().format('YYYY'), 10)
                    newDate = moment(day + '-' + month + '-' + year, 'DD/MM/YYYY')
                    return newDate.isValid() ? newDate.format('DD/MM/YYYY') : ''
                case 2:
                    day = parseInt(value.split('/')[0], 10)
                    month = parseInt(value.split('/')[1], 10)
                    year = parseInt(value.split('/')[2], 10)
                    newDate = moment(day + '-' + month + '-' + year, 'DD/MM/YYYY')
                    return newDate.isValid() ? newDate.format('DD/MM/YYYY') : ''
                default:
                    return ''
            }
        }
        return ''
    }

}
