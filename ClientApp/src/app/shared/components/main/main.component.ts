import { Component } from '@angular/core';

@Component({
	selector: 'main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.css']
})

export class MainComponent {

	toggleMenu() {
		document.getElementById("slide").classList.toggle("open");
		var sidebar = document.getElementById("sidebar");
		sidebar.style.width = sidebar.style.width == "250px" ? "0" : "250px";
	}

}
