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
		document.getElementById("hamburger").classList.toggle("open")
		var sidebar = document.getElementById("sidebar")
		sidebar.style.width = sidebar.style.width == "20rem" ? "0" : "20rem"
	}

	private positionHamburger() {
		var hamburger = document.getElementById("hamburger")
		console.log(window.innerHeight)
		hamburger.style.top = window.innerHeight - 68 + 'px'
	}

}
