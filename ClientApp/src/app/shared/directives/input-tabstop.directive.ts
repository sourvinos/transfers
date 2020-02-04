import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({ selector: '[inputTabStop]' })

export class InputTabStopDirective {

    @Input('inputTabStop') format: string;

    @HostListener('keyup', ['$event']) onkeyup(event: { key: string; target: { getAttribute: { (arg0: string): void; (arg0: string): void } } }) {

        const elements = Array.prototype.slice.apply(document.querySelectorAll("input[tabindex]"));

        if (event.key == 'Enter' || event.key == 'ArrowDown') {
            var nextTab = +(event.target.getAttribute('tabindex')) + 1
            for (var i = elements.length; i--;) {
                if (nextTab > elements.length) nextTab = 1
                if (+(elements[i].getAttribute('tabindex')) == nextTab && !elements[i].getAttribute('disabled')) {
                    elements[i].focus()
                    elements[i].select()
                    break
                }
            }
        }

        if (event.key == 'ArrowUp') {
            var previousTab = +(event.target.getAttribute('tabindex')) - 1
            for (var i = elements.length; i--;) {
                if (previousTab == 0) previousTab = elements.length
                if (+(elements[i].getAttribute('tabindex')) == previousTab) {
                    elements[i].focus()
                    elements[i].select()
                    break
                }
            }

        }

    }

}
