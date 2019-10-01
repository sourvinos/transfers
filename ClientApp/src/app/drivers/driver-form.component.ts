import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DialogService } from '../services/dialog-service';
import { DriverService } from '../services/driver.service';
import { HelperService } from '../services/helper.service';
import { Utils } from '../shared/classes/utils';

@Component({
    selector: 'app-driver-form',
    templateUrl: './driver-form.component.html',
    styleUrls: ['../shared/styles/forms.css']
})

export class DriverFormComponent implements OnInit, AfterViewInit {

    id: number = null;
    isSaving: boolean = false

    form = this.formBuilder.group({
        id: 0,
        description: ['', [Validators.required, Validators.maxLength(100)]]
    })

    constructor(private driverService: DriverService, private helperService: HelperService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private dialogService: DialogService) {
        route.params.subscribe(p => (this.id = p['id']))
    };

    ngOnInit() {
        if (this.id) {
            this.driverService.getDriver(this.id).subscribe(result => {
                this.populateFields()
            }, error => {
                if (error.status == 404) {
                    this.router.navigate(['/error'])
                }
            });
        }
    }

    ngAfterViewInit(): void {
        document.getElementById("description").focus()
    }

    populateFields() {
        this.driverService.getDriver(this.id).subscribe(
            result => {
                this.form.setValue({
                    id: result.id,
                    description: result.description
                })
            },
            error => {
                Utils.errorLogger(error);
            });;
    }

    get description() {
        return this.form.get('description');
    }

    getRequiredFieldMessage() {
        return 'This field is required, silly!';
    }

    getMaxLengthFieldMessage() {
        return 'This field must not be longer than '
    }

    save() {
        if (!this.form.valid) return
        this.isSaving = true
        this.form.value.userName = this.helperService.getUsernameFromLocalStorage()
        if (this.id == null) {
            this.driverService.addDriver(this.form.value).subscribe(() => this.router.navigate(['/drivers']), error => Utils.errorLogger(error));
        }
        else {
            this.driverService.updateDriver(this.id, this.form.value).subscribe(() => this.router.navigate(['/drivers']), error => Utils.errorLogger(error));
        }
    }

    delete() {
        if (this.id !== null) {
            if (confirm('This record will permanently be deleted. Are you sure?')) {
                this.driverService.deleteDriver(this.id).subscribe(() => this.router.navigate(['/drivers']), error => Utils.errorLogger(error));
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
