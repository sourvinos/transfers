import { ActivatedRoute, Router } from '@angular/router'
import { Component } from "@angular/core"
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common'

@Component({
    selector: 'app-transfer-wrapper',
    templateUrl: './wrapper-transfer.html',
    styleUrls: ['./wrapper-transfer.css']
})

export class TransferWrapperComponent {

    dateIn: string = '2019-10-01'

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private location: Location) { }

    // T
    loadTransfers() {
        this.router.navigate(['dateIn/', this.dateIn], {
            relativeTo: this.activatedRoute
        })
    }

    // T
    newRecord() {
        this.router.navigate([this.location.path() + '/transfer/new'])
    }

}
