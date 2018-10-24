import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import {
    ModelWithButtonComponent
} from '../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';

@Component({
    selector: 'app-select-nationality',
    templateUrl: './select-nationality.component.html',
    styleUrls: ['./select-nationality.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SelectNationalityComponent implements OnInit {
    selectNationalityForm: FormGroup;
    nationalitylist: any;
    selectedNationality: any;
    nationality: any;
    formValues: any;
    blocked: any;
    country: any;
    notSingaporeNationality = false;
    singaporeNationality = false;
    nationalityObj: any;
    selectNationalityFormValues: any;
    editModalData: any;
    modalTitle: any;
    modalMessage: any;
    ButtonTitle: any;
    editModalData1: any;
    modalTitle1: any;
    modalMessage1: any;
    countries: ['Singapore', 'India'];
    constructor(
        public headerService: HeaderService,
        public navbarService: NavbarService,
        public activeModal: NgbActiveModal,
        private router: Router,
        private formBuilder: FormBuilder,
        private investmentAccountService: InvestmentAccountService,
        private modal: NgbModal,
        public authService: AuthenticationService,
        public readonly translate: TranslateService) {
        this.translate.use('en');
        this.translate.get('COMMON').subscribe(() => {
            this.editModalData = this.translate.instant('SELECT_NATIONALITY.editModalData');
            this.editModalData1 = this.translate.instant('SELECT_NATIONALITY.editModalData1');
        });
    }

    ngOnInit() {
        this.navbarService.setNavbarMobileVisibility(true);
        this.navbarService.setNavbarMode(1);
        this.getNationalityList();
        this.selectNationalityFormValues = this.investmentAccountService.getNationality();
        this.nationalityObj = this.selectNationalityFormValues.nationality;
        this.nationality = this.selectNationalityFormValues.nationality &&
            this.selectNationalityFormValues.nationality.nationality ?
            this.selectNationalityFormValues.nationality.nationality : 'Select Nationality';
        this.selectNationalityForm = new FormGroup({
            nationality: new FormControl(this.selectNationalityFormValues.nationality)
        });
        this.buildFormControls();
    }

    buildFormControls() {
        if (this.nationality === 'Select Nationality' || this.blocked) {
            this.singaporeNationality = false;
            this.notSingaporeNationality = false;
        } else if (this.nationality === 'SINGAPOREAN') {
            this.singaporeNationality = true;
            this.notSingaporeNationality = false;
            this.selectNationalityForm = new FormGroup({
                unitedStatesResident: new FormControl(this.selectNationalityFormValues.unitedStatesResident, Validators.required)
            });
        } else {
            this.singaporeNationality = true;
            this.notSingaporeNationality = true;
            this.selectNationalityForm = new FormGroup({
                unitedStatesResident: new FormControl(this.selectNationalityFormValues.unitedStatesResident, Validators.required),
                singaporeanResident: new FormControl(this.selectNationalityFormValues.singaporeanResident, Validators.required)
            });
        }
    }

    selectNationality(nationalityObj) {
        this.nationalityObj = nationalityObj;
        this.blocked = this.nationalityObj.blocked;
        this.nationality = this.nationalityObj.nationality;
        this.country = this.nationalityObj.country;
        this.buildFormControls();
    }

    getNationalityList() {
        this.authService.authenticate().subscribe((token) => {
            this.investmentAccountService.getNationalityList().subscribe((data) => {
                this.nationalitylist = data.objectList;
            });
        });
    }
    save(form) {
        const singaporeanResident = form.controls.singaporeanResident ? form.controls.singaporeanResident.value : '';
        this.investmentAccountService.setNationality(this.nationalitylist, this.nationalityObj,
            form.controls.unitedStatesResident.value, singaporeanResident);
    }

    showErrorMessage(modalTitle: any, modalMessage: any) {
        const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
        ref.componentInstance.errorTitle = modalTitle;
        ref.componentInstance.errorMessage = modalMessage;
        ref.componentInstance.primaryActionLabel = this.editModalData.ButtonTitle;
        ref.componentInstance.primaryAction.subscribe(() => {
            this.router.navigate(['home']);

        });
    }

    goToNext(form) {
        if (this.blocked) {
            this.showErrorMessage(this.editModalData.modalTitle, this.editModalData.modalMessage);
        } else if (form.valid && form.controls.unitedStatesResident) {
            if ((this.nationality === 'SINGAPOREAN' &&
                form.controls.unitedStatesResident.value === 'yes') ||
                ((form.controls.unitedStatesResident.value === 'yes' && form.controls.singaporeanResident.value === 'yes')
                    || (form.controls.unitedStatesResident.value === 'yes' && form.controls.singaporeanResident.value === 'no'))) {
                this.showErrorMessage(this.editModalData1.modalTitle1, this.editModalData1.modalMessage1);
            } else {
                this.save(form);
                this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.PERSONAL_INFO]);
            }
        }
    }
}
