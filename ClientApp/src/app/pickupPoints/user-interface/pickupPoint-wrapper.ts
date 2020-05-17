import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Route } from 'src/app/routes/classes/route';
import { RouteService } from 'src/app/routes/classes/route.service';
import { InteractionService } from 'src/app/shared/services/interaction.service';
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service';

@Component({
    selector: 'pickuppoint-wrapper',
    templateUrl: './pickupPoint-wrapper.html',
    styleUrls: ['./pickupPoint-wrapper.css']
})

export class PickupPointWrapperComponent implements OnInit, OnDestroy {

    //#region Private
    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();
    //#endregion

    //#region Private particular
    id = ''
    activeRoute: string
    routes: Route[] = []
    //#endregion

    constructor(private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private activatedRoute: ActivatedRoute, private routeService: RouteService, private interactionService: InteractionService) {
        if (this.router.url.split('/').length === 2) {
            this.interactionService.wrapperHeader.subscribe((response) => {
                this.activeRoute = response
            })
        }
    }

    ngOnInit() {
        this.addShortcuts()
        this.populateDropDowns()
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.unsubscribe();
        this.unlisten()
    }

    public onGoBack() {
        this.router.navigate(['/'])
    }

    public onLoadPickupPoints() {
        this.navigateToList()
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': () => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.onGoBack()
                }
            }
        }, {
            priority: 0,
            inputs: true
        })
    }

    private navigateToList() {
        this.router.navigate(['routeId/', this.id], { relativeTo: this.activatedRoute })
    }

    private populateDropDowns() {
        this.routeService.getAllActive().subscribe((result: any) => {
            this.routes = result.sort((a: { description: number; }, b: { description: number; }) => (a.description > b.description) ? 1 : -1)
        })
    }

}
