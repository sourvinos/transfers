import { Directive, HostListener, Input } from '@angular/core';

@Directive({ selector: '[inputTabStop]' })

export class InputTabStopDirective {

    @Input('inputTabStop') format: string;

    @HostListener('keydown', ['$event']) onkeydown(event: { target: { getAttribute: (arg0: string) => string; }; key: string; preventDefault: () => void; }) {
        if (event.target.getAttribute('type') === 'number' && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            event.preventDefault()
        }
    }

    @HostListener('keyup', ['$event']) onkeyup(event: { preventDefault: () => void; key: string; target: { getAttribute: (arg0: string) => any; }; }) {

        const elements = Array.prototype.slice.apply(document.querySelectorAll('input[data-tabindex]'));

        if (event.key === 'Enter' || event.key === 'ArrowDown') {
            let nextTab = +(event.target.getAttribute('data-tabindex')) + 1
            for (let i = elements.length; i--;) {
                if (nextTab > elements.length) { nextTab = 1 }
                if (+(elements[i].getAttribute('data-tabindex')) === nextTab && !elements[i].getAttribute('disabled')) {
                    elements[i].focus()
                    elements[i].select()
                    break
                }
            }
        }

        if (event.key === 'ArrowUp') {
            let previousTab = +(event.target.getAttribute('data-tabindex')) - 1
            for (let i = elements.length; i--;) {
                if (previousTab === 0) { previousTab = elements.length }
                if (+(elements[i].getAttribute('data-tabindex')) === previousTab) {
                    elements[i].focus()
                    elements[i].select()
                    break
                }
            }

        }

    }

}
