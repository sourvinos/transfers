import { ActivatedRoute, Router } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, Validators, FormControl } from '@angular/forms'
import { forkJoin } from 'rxjs'

import { CustomerService } from '../services/customer.service'
import { TaxOfficeService } from '../services/taxOffice.service'
import { VatStateService } from '../services/vatState.service'
import { Utils } from '../shared/classes/utils'

@Component({
    selector: 'app-customer-form',
    templateUrl: './customer-form.component.html',
    styleUrls: ['../shared/styles/forms.css']
})

export class CustomerFormComponent implements OnInit {

    taxOffices: any
    vatStates: any

    id: number = null

    form = this.formBuilder.group({
        id: 0,
        description: ['', [Validators.required, Validators.maxLength(100)]],
        profession: ['', [Validators.maxLength(100)]],
        taxOfficeId: ['', Validators.required],
        taxOfficeDescription: ['', Validators.required],
        vatStateId: ['', Validators.required],
        vatStateDescription: ['', Validators.required],
        address: ['', [Validators.maxLength(100)]],
        phones: ['', [Validators.maxLength(100)]],
        personInCharge: ['', [Validators.maxLength(100)]],
        email: ['', [Validators.maxLength(100)]],
        taxNo: ['', [Validators.maxLength(100)]],
        accountCode: ['', [Validators.maxLength(100)]],
        user: ['']
    })

    constructor(private customerService: CustomerService, private taxOfficeService: TaxOfficeService, private vatStateService: VatStateService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {
        route.params.subscribe(p => (this.id = p['id']))
    }

    ngOnInit() {
        let sources = []
        sources.push(this.taxOfficeService.getTaxOffices())
        sources.push(this.vatStateService.getVatStates())
        if (this.id) {
            sources.push(this.customerService.getCustomer(this.id))
        }
        return forkJoin(sources).subscribe(
            result => {
                this.taxOffices = result[0]
                this.vatStates = result[1]
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

    private populateFields() {
        this.customerService.getCustomer(this.id).subscribe(
            result => {
                this.form.setValue({
                    id: result.id,
                    description: result.description,
                    profession: result.profession,
                    taxOfficeId: result.taxOffice.id,
                    taxOfficeDescription: result.taxOffice.description,
                    vatStateId: result.vatState.id,
                    vatStateDescription: result.vatState.description,
                    address: result.address,
                    phones: result.phones,
                    personInCharge: result.personInCharge,
                    email: result.email,
                    taxNo: result.taxNo,
                    accountCode: result.accountCode,
                    user: result.user
                })
            },
            error => {
                Utils.ErrorLogger(error)
            })
    }

    get description() {
        return this.form.get('description')
    }

    get profession() {
        return this.form.get('profession')
    }

    get address() {
        return this.form.get('address')
    }

    get phones() {
        return this.form.get('phones')
    }

    get personInCharge() {
        return this.form.get('personInCharge')
    }

    get email() {
        return this.form.get('email')
    }

    get taxNo() {
        return this.form.get('taxNo')
    }

    get accountCode() {
        return this.form.get('accountCode')
    }

    get taxOfficeId() {
        return this.form.get('taxOfficeId')
    }

    get taxOfficeDescription() {
        return this.form.get('taxOfficeDescription')
    }

    get vatStateId() {
        return this.form.get('vatStateId')
    }

    get vatStateDescription() {
        return this.form.get('vatStateDescription')
    }

    getRequiredFieldMessage() {
        return 'This field is required, silly!'
    }

    getMaxLengthFieldMessage() {
        return 'This field must not be longer than '
    }

    save() {
        if (!this.form.valid) return
        if (this.id == null) {
            this.customerService.addCustomer(this.form.value).subscribe(data => this.router.navigate(['/customers']), error => Utils.ErrorLogger(error))
        }
        else {
            this.customerService.updateCustomer(this.form.value.id, this.form.value).subscribe(data => this.router.navigate(['/customers']), error => Utils.ErrorLogger(error))
        }
    }

    delete() {
        if (this.id != null) {
            if (confirm('This record will permanently be deleted. Are you sure?')) {
                this.customerService.deleteCustomer(this.id).subscribe(data => this.router.navigate(['/customers']), error => Utils.ErrorLogger(error))
            }
        }
    }

    goBack() {
        this.router.navigate(['/customers'])
    }

    arrayLookup(lookupArray: any[], givenField: FormControl) {
        for (let x of lookupArray) {
            if (x.description.toLowerCase() == givenField.value.toLowerCase()) {
                return true
            }
        }
    }

    updateTaxOfficeId(lookupArray: any[], e: { target: { value: any } }): void {
        let name = e.target.value
        let list = lookupArray.filter(x => x.description === name)[0]

        this.form.patchValue({ taxOfficeId: list ? list.id : '' })
    }

    updateVatStateId(lookupArray: any[], e: { target: { value: any } }): void {
        let name = e.target.value
        let list = lookupArray.filter(x => x.description === name)[0]

        this.form.patchValue({ vatStateId: list ? list.id : '' })
    }

}
