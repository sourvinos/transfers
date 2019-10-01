import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DialogService } from '../services/dialog-service';
import { HelperService } from '../services/helper.service';
import { PortService } from '../services/port.service';
import { Utils } from '../shared/classes/utils';

@Component({
    selector: 'app-port-form',
    templateUrl: './port-form.component.html',
    styleUrls: ['../shared/styles/forms.css']
})

export class PortFormComponent implements OnInit, AfterViewInit {

    id: number = null;
    isSaving: boolean = false

    form = this.formBuilder.group({
        id: 0,
        description: ['', [Validators.required, Validators.maxLength(100)]]
    })

    constructor(private portService: PortService, private helperService: HelperService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private dialogService: DialogService) {
        route.params.subscribe(p => (this.id = p['id']))
    };

    ngOnInit() {
        if (this.id) {
            this.portService.getPort(this.id).subscribe(result => {
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
        this.portService.getPort(this.id).subscribe(
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
            this.portService.addPort(this.form.value).subscribe(data => this.router.navigate(['/ports']), error => Utils.errorLogger(error));
        }
        else {
            this.portService.updatePort(this.id, this.form.value).subscribe(data => this.router.navigate(['/ports']), error => Utils.errorLogger(error));
        }
    }

    delete() {
        if (this.id !== null) {
            if (confirm('This record will permanently be deleted. Are you sure?')) {
                this.portService.deletePort(this.id).subscribe(data => this.router.navigate(['/ports']), error => Utils.errorLogger(error));
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
