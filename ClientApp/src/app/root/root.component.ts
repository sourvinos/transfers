import { Component, HostListener } from '@angular/core';

@Component({
    selector: 'root',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.css']
})

export class RootComponent {

    @HostListener('keyup', ['$event']) onkeyup(event: { key: string; target: { getAttribute: { (arg0: string): void; (arg0: string): void; }; }; }) {
        if (event.key == 'Enter' || event.key == 'ArrowDown') {
            var nextTab = +(event.target.getAttribute('tabindex')) + 1
            var elements = document.getElementsByTagName('input');
            for (var i = elements.length; i--;) {
                if (nextTab > elements.length) nextTab = 1
                if (+(elements[i].getAttribute('tabindex')) == nextTab) {
                    elements[i].focus()
                    elements[i].select()
                    break
                }
            }
        }

        if (event.key == 'ArrowUp') {
            var previousTab = +(event.target.getAttribute('tabindex')) - 1
            var elements = document.getElementsByTagName('input');
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
