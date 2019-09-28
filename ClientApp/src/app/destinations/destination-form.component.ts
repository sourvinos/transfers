import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DestinationService } from '../services/destination.service';
import { DialogService } from '../services/dialog-service';
import { HelperService } from '../services/helper.service';
import { Utils } from '../shared/classes/utils';

@Component({
    selector: 'app-destination-form',
    templateUrl: './destination-form.component.html',
    styleUrls: ['../shared/styles/forms.css']
})

export class DestinationFormComponent implements OnInit, AfterViewInit {

    id: number = null
    isSaving: boolean = false

    form = this.formBuilder.group({
        id: 0,
        abbreviation: ['', [Validators.maxLength(5)]],
        description: ['', [Validators.required, Validators.maxLength(100)]]
    })

    constructor(private destinationService: DestinationService, private helperService: HelperService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private dialogService: DialogService) {
        route.params.subscribe(p => (this.id = p['id']))
    };

    ngOnInit() {
        if (this.id) {
            this.destinationService.getDestination(this.id).subscribe(result => {
                this.populateFields()
            }, error => {
                if (error.status == 404) {
                    this.router.navigate(['/pageNotFound'])
                }
            });
        }
    }

    ngAfterViewInit(): void {
        document.getElementById("abbreviation").focus()
    }

    populateFields() {
        this.destinationService.getDestination(this.id).subscribe(
            result => {
                this.form.setValue({
                    id: result.id,
                    abbreviation: result.abbreviation,
                    description: result.description
                })
            },
            error => {
                Utils.ErrorLogger(error);
            });;
    }

    get abbreviation() {
        return this.form.get('abbreviation');
    }

    get description() {
        return this.form.get('description');
    }

    save() {
        if (!this.form.valid) return
        this.isSaving = true
        this.form.value.userName = this.helperService.getUsernameFromLocalStorage()
        if (this.id == null) {
            this.destinationService.addDestination(this.form.value).subscribe(() => this.router.navigate(['/destinations']), error => Utils.ErrorLogger(error));
        }
        else {
            this.destinationService.updateDestination(this.id, this.form.value).subscribe(() => this.router.navigate(['/destinations']), error => Utils.ErrorLogger(error));
        }
    }

    delete() {
        if (this.id !== null) {
            if (confirm('This record will permanently be deleted. Are you sure?')) {
                this.destinationService.deleteDestination(this.id).subscribe(() => this.router.navigate(['/destinations']), error => Utils.ErrorLogger(error));
            }
        }
    }

    canDeactivate(): Observable<boolean> | boolean {
        if (!this.isSaving && this.form.dirty) {
            this.isSaving = false
            return this.dialogService.confirm('Discard changes?');
        }
        return true;
    }

}