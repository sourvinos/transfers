import { Component, HostListener, AfterViewInit } from '@angular/core'

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})

export class MainComponent implements AfterViewInit {

    ngAfterViewInit() {
        this.positionHamburger()
    }

    @HostListener('window:resize', ['$event']) onResize(event: { target: { innerWidth: any; }; }) {
        this.positionHamburger()
    }

    onToggleMenu() {
        document.getElementById('hamburger').classList.toggle('open')
        const sidebar = document.getElementById('sidebar')
        sidebar.style.width = sidebar.style.width === '17rem' ? '0' : '17rem'
    }

    private positionHamburger() {
        const hamburger = document.getElementById('hamburger')
        hamburger.style.top = window.innerHeight - 68 + 'px'
    }

}
