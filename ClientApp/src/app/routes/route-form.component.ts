// Base
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { HelperService } from '../services/helper.service';
// Custom
import { PortService } from '../services/port.service';
import { RouteService } from '../services/route.service';
import { Utils } from '../shared/classes/utils';

@Component({
    selector: 'app-route-form',
    templateUrl: './route-form.component.html',
    styleUrls: ['../shared/styles/forms.css']
})

export class RouteFormComponent implements OnInit {

    ports: any

    id: number = null;

    form = this.formBuilder.group({
        id: 0,
        shortDescription: ['', [Validators.maxLength(10)]],
        description: ['', [Validators.required, Validators.maxLength(100)]],
        portId: [''],
        portDescription: ['']
    })

    constructor(private routeService: RouteService, private portService: PortService, private helperService: HelperService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {
        route.params.subscribe(p => (this.id = p['id']))
    };

    ngOnInit() {
        let sources = []
        sources.push(this.portService.getPorts())
        if (this.id) {
            sources.push(this.routeService.getRoute(this.id))
        }
        return forkJoin(sources).subscribe(
            result => {
                this.ports = result[0]
                if (this.id) {
                    this.populateFields()
                }
            },
            error => {
                if (error.status == 404) {
                    this.router.navigate(['/error'])
                }
            }
        )
    }

    populateFields() {
        this.routeService.getRoute(this.id).subscribe(
            result => {
                this.form.setValue({
                    id: result.id,
                    shortDescription: result.shortDescription,
                    description: result.description,
                    portId: result.port.id,
                    portDescription: result.port.description
                })
            },
            error => {
                Utils.ErrorLogger(error);
            });;
    }

    get shortDescription() {
        return this.form.get('shortDescription');
    }

    get description() {
        return this.form.get('description');
    }

    get portId() {
        return this.form.get('portId')
    }

    get portDescription() {
        return this.form.get('portDescription')
    }

    getRequiredFieldMessage() {
        return 'This field is required, silly!';
    }

    getMaxLengthFieldMessage() {
        return 'This field must not be longer than '
    }

    save() {
        if (!this.form.valid) return
        this.form.value.userName = this.helperService.getUsernameFromLocalStorage()
        if (this.id == null) {
            this.routeService.addRoute(this.form.value).subscribe(data => this.router.navigate(['/routes']), error => Utils.ErrorLogger(error));
        }
        else {
            this.routeService.updateRoute(this.id, this.form.value).subscribe(data => this.router.navigate(['/routes']), error => Utils.ErrorLogger(error));
        }
    }

    delete() {
        if (this.id != null) {
            if (confirm('This record will permanently be deleted. Are you sure?')) {
                this.routeService.deleteRoute(this.id).subscribe(data => this.router.navigate(['/routes']), error => Utils.ErrorLogger(error));
            }
        }
    }

    goBack() {
        this.router.navigate(['/routes']);
    }

    arrayLookup(lookupArray: any[], givenField: FormControl) {
        for (let x of lookupArray) {
            if (x.description.toLowerCase() == givenField.value.toLowerCase()) {
                return true
            }
        }
    }
    updatePortId(lookupArray: any[], e: { target: { value: any } }): void {

        let name = e.target.value
        let list = lookupArray.filter(x => x.description === name)[0]

        this.form.patchValue({ portId: list ? list.id : '' })
    }

}
