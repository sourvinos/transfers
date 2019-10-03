import { Component } from '@angular/core';

@Component({
	selector: 'main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.css']
})

export class MainComponent {

	toggleMenu() {
		document.getElementById("hamburger").classList.toggle("open");
		var sidebar = document.getElementById("sidebar");
		sidebar.style.width = sidebar.style.width == "20rem" ? "0" : "20rem";
	}

}
