import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { IRoute } from '../models/route'
import { KeyboardShortcuts, Unlisten } from '../services/keyboard-shortcuts.service'
import { RouteService } from '../services/route.service'
import { Utils } from '../shared/classes/utils'

@Component({
    selector: 'route-list',
    templateUrl: './route-list.component.html',
    styleUrls: ['../shared/styles/lists.css']
})

export class RouteListComponent implements OnInit, OnDestroy {

    //#region Init

    coachRoutes: IRoute[]
    filteredRoutes: IRoute[]

    unlisten: Unlisten

    //#endregion

    constructor(private service: RouteService, private keyboardShortcutsService: KeyboardShortcuts, private router: Router) {
        this.unlisten = null
    }

    ngOnInit() {
        this.getAllRoutes()
        this.addShortcuts()
        this.setFocus('searchField')
    }

    ngOnDestroy(): void {
        (this.unlisten) && this.unlisten();
    }

    // T
    filter(query: string) {
        this.filteredRoutes = query ? this.coachRoutes.filter(p => p.description.toLowerCase().includes(query.toLowerCase())) : this.coachRoutes
    }

    // T
    newRecord() {
        this.router.navigate(['/routes/new'])
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            "Alt.N": (event: KeyboardEvent): void => {
                event.preventDefault()
                document.getElementById('new').click()
            }
        }, {
            priority: 1,
            inputs: true
        })
    }

    private getAllRoutes() {
        this.service.getRoutes().subscribe(data => this.filteredRoutes = this.coachRoutes = data, error => Utils.errorLogger(error))
    }

    private setFocus(element: string) {
        Utils.setFocus(element)
    }

}
