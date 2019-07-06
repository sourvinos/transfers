import * as moment from 'moment'
import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[appInputFormat]'
})

export class InputFormatDirective {

    @Input('appInputFormat') format: string;

    constructor(private el: ElementRef) { }

    @HostListener('focus') onFocus() { }

    @HostListener('blur') onBlur() {
        if (this.format == 'lowerCase') {
            let value: string = this.el.nativeElement.value
            this.el.nativeElement.value = value.toLowerCase()

        }
        if (this.format == 'upperCase') {
            let value: string = this.el.nativeElement.value
            this.el.nativeElement.value = value.toUpperCase()
        }

        if (this.format == 'date') {

            let day: number
            let month: number
            let year: number
            let newDate: moment.Moment

            let value: string = this.el.nativeElement.value

            let seperatorCount = 0;
            let position = value.indexOf('/');

            while (position !== -1) {
                seperatorCount++;
                position = value.indexOf('/', position + 1);
            }

            if (value) {
                switch (seperatorCount) {
                    case 0:
                        day = parseInt(value.split("/")[0]) < 32 ? parseInt(value.split("/")[0]) : 0
                        month = parseInt(moment().format("MM"))
                        year = parseInt(moment().format("YYYY"))
                        newDate = moment(day + "-" + month + "-" + year, 'DD/MM/YYYY')
                        this.el.nativeElement.value = newDate.isValid() ? newDate.format("DD/MM/YYYY") : ""
                        break
                    case 1:
                        day = parseInt(value.split("/")[0]) < 32 ? parseInt(value.split("/")[0]) : 0
                        month = parseInt(value.split("/")[1])
                        year = parseInt(moment().format("YYYY"))
                        newDate = moment(day + "-" + month + "-" + year, 'DD/MM/YYYY')
                        this.el.nativeElement.value = newDate.isValid() ? newDate.format("DD/MM/YYYY") : ""
                        break
                    case 2:
                        day = parseInt(value.split("/")[0])
                        month = parseInt(value.split("/")[1])
                        year = parseInt(value.split("/")[2])
                        newDate = moment(day + "-" + month + "-" + year, 'DD/MM/YYYY')
                        this.el.nativeElement.value = newDate.isValid() ? newDate.format("DD/MM/YYYY") : ""
                        break
                    default:
                        this.el.nativeElement.value = ""
                }
            }

        }
    }

    @HostListener('keyup') onkeyup() {
        if (this.format == 'date') {
            let value: string = this.el.nativeElement.value
            value = value.replace(/[-,.]/g, '/').replace(/[^0-9/]/g, '')
            this.el.nativeElement.value = value
        }
    }

}
