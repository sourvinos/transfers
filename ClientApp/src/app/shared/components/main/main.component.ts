import { Component, HostListener, AfterViewInit } from '@angular/core'

@Component({
	selector: 'main',
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

	toggleMenu() {
		document.getElementById('hamburger').classList.toggle('open')
		var sidebar = document.getElementById('sidebar')
		var main = document.getElementById('main')
		sidebar.style.width = sidebar.style.width == '20rem' ? '0' : '20rem'
		// main.style.paddingLeft = '20rem'
	}

	private positionHamburger() {
		var hamburger = document.getElementById('hamburger')
		hamburger.style.top = window.innerHeight - 68 + 'px'
	}

}
