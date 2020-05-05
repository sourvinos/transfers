import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Route } from 'src/app/routes/classes/route';
import { RouteService } from 'src/app/routes/classes/route.service';
import { BaseInteractionService } from 'src/app/shared/services/base-interaction.service';
import { KeyboardShortcuts, Unlisten } from 'src/app/shared/services/keyboard-shortcuts.service';

@Component({
    selector: 'pickuppoint-wrapper',
    templateUrl: './pickupPoint-wrapper.html',
    styleUrls: ['../../shared/styles/lists.css', './pickupPoint-wrapper.css']
})

export class PickupPointWrapperComponent implements OnInit, OnDestroy {

    id = ''
    routes: Route[] = []
    unlisten: Unlisten
    ngUnsubscribe = new Subject<void>();

    constructor(private keyboardShortcutsService: KeyboardShortcuts, private router: Router, private activatedRoute: ActivatedRoute, private interactionPickupPointService: BaseInteractionService, private routeService: RouteService) { }

    ngOnInit() {
        this.addShortcuts()
        this.populateDropDowns()
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.unsubscribe();
        this.unlisten()
    }

    onLoadPickupPoints() {
        this.navigateToList()
    }

    private addShortcuts() {
        this.unlisten = this.keyboardShortcutsService.listen({
            'Escape': (event: KeyboardEvent): void => {
                if (document.getElementsByClassName('cdk-overlay-pane').length === 0) {
                    this.onGoBack()
                }
            }
        }, {
            priority: 0,
            inputs: true
        })
    }

    private onGoBack() {
        this.router.navigate(['/'])
    }

    private navigateToList() {
        this.router.navigate(['routeId/', this.id], { relativeTo: this.activatedRoute })
    }

    private populateDropDowns() {
        this.routeService.getAll().subscribe((result: any) => {
            this.routes = result
        })
    }

}
