import { Component, AfterViewInit, HostListener, OnInit, OnDestroy } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap'
import { Subject } from 'rxjs'

@Component({
    selector: 'modal-index',
    templateUrl: './modal-index.component.html',
    styleUrls: ['./modal-index.component.css']
})

export class ModalIndexComponent implements OnInit, AfterViewInit, OnDestroy {

    list: any[] = [];
    currentItem: number = 0

    subject: Subject<any>

    constructor(public bsModalRef: BsModalRef) { }

    ngOnInit() {
        this.currentItem = 0
    }

    ngAfterViewInit() {
        document.querySelectorAll('li.index-item')[0].classList.add('selected')
    }

    ngOnDestroy() {
        this.subject.next('')
    }

    action(value: boolean | any) {
        this.bsModalRef.hide()
        this.subject.next(value)
        this.subject.complete()
    }

    @HostListener('document:keydown', ['$event']) anyEvent(event: { altKey: any; shiftKey: any; key: { toUpperCase: { (): string; (): string; (): string; (): string; (): string; }; }; }) {
        if (event.key == 'ArrowUp') {
            document.querySelectorAll('li.index-item')[this.currentItem].classList.remove('selected')
            this.currentItem = --this.currentItem < 0 ? this.currentItem = this.list.length - 1 : this.currentItem
            document.querySelectorAll('li.index-item')[this.currentItem].classList.add('selected')
        }
        if (event.key == 'ArrowDown') {
            document.querySelectorAll('li.index-item')[this.currentItem].classList.remove('selected')
            this.currentItem = ++this.currentItem >= this.list.length ? this.currentItem = 0 : this.currentItem
            document.querySelectorAll('li.index-item')[this.currentItem].classList.add('selected')
        }
        if (event.key == "Enter") {
            this.action(this.list[this.currentItem])
        }
    }

}