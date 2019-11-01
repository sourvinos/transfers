import { Component, AfterViewInit, HostListener, OnInit, OnDestroy } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap'
import { Subject } from 'rxjs'
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

interface TableItem {
    name: string;
}

@Component({
    selector: 'modal-index',
    templateUrl: './modal-index.component.html',
    styleUrls: ['./modal-index.component.css']
})

export class ModalIndexComponent implements OnInit, AfterViewInit, OnDestroy {

    list: any[] = [];
    currentItem: number = 0

    columns = ['id', 'name']
    dataSource: MatTableDataSource<TableItem>;
    selection: SelectionModel<TableItem>;

    subject: Subject<any>

    constructor(public bsModalRef: BsModalRef) { }

    ngOnInit() {
        this.dataSource = new MatTableDataSource<TableItem>(this.list);
        this.selection = new SelectionModel<TableItem>(false);

        this.currentItem = 0
    }

    ngAfterViewInit() {
        // document.querySelectorAll('.index-row')[0].classList.add('selected')
        // console.log(this.list[0].id)
        // document.getElementById(this.list[0].id).classList.add('selected')
        // document.getElementById(tr[this.list[0].id]).focus()
        // console.log(document.getElementsByTagName('tr.index-row'))
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
        if (event.key == 'Enter') {
            this.action({ 'id': document.querySelector('tr.selected').children[0].textContent, 'description': document.querySelector('tr.selected').children[1].textContent })
        }
    }

    doubleClick() {
        this.action({ 'id': document.querySelector('tr.selected').children[0].textContent, 'description': document.querySelector('tr.selected').children[1].textContent })
    }

    // @HostListener('document:keydown', ['$event']) anyEvent(event: { altKey: any; shiftKey: any; key: { toUpperCase: { (): string; (): string; (): string; (): string; (): string; }; }; }) {
    //     if (event.key == 'ArrowUp') {
    //         document.querySelectorAll('li.index-item')[this.currentItem].classList.remove('selected')
    //         this.currentItem = --this.currentItem < 0 ? this.currentItem = this.list.length - 1 : this.currentItem
    //         document.querySelectorAll('li.index-item')[this.currentItem].classList.add('selected')
    //     }
    //     if (event.key == 'ArrowDown') {
    //         document.querySelectorAll('li.index-item')[this.currentItem].classList.remove('selected')
    //         this.currentItem = ++this.currentItem >= this.list.length ? this.currentItem = 0 : this.currentItem
    //         document.querySelectorAll('li.index-item')[this.currentItem].classList.add('selected')
    //     }
    //     if (event.key == "Enter") {
    //         this.action(this.list[this.currentItem])
    //     }
    // }

}