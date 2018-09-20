import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from '../../shared/header/header.service';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';
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
    afterSelectedNationality = false;
    beforeSelectedNationality = true;
    formValues: any;
    blocked: any;
    country: any;
    Question = false;
    singaporeQuestion = false;
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
        public activeModal: NgbActiveModal,
        private router: Router,
        private investmentAccountService: InvestmentAccountService,
        private modal: NgbModal,
        public readonly translate: TranslateService) {
        this.translate.use('en');
        this.translate.get('COMMON').subscribe(() => {
            this.editModalData = this.translate.instant('SELECT_NATIONALITY.editModalData');
            this.editModalData1 = this.translate.instant('SELECT_NATIONALITY.editModalData1');
        });
    }

    ngOnInit() {
        this.headerService.setHeaderVisibility(false);
        this.getNationalityList();
        this.selectNationalityFormValues = this.investmentAccountService.getNationality();
        this.selectNationalityForm = new FormGroup({
            selectNationalitySingapore: new FormControl(this.selectNationalityFormValues.selectNationalitySingapore, Validators.required)
        });
    }
    selectNationality(nationalityObj) {
        this.nationalityObj = nationalityObj;
        this.blocked = this.nationalityObj.blocked;
        this.nationality = this.nationalityObj.nationality;
        this.country = this.nationalityObj.country;
        this.afterSelectedNationality = true;
        this.beforeSelectedNationality = false;
        this.Question = false;
        this.singaporeQuestion = false;
    }
    getNationalityList() {
        this.investmentAccountService.getNationalityList().subscribe((data) => {
            this.nationalitylist = data.objectList;
            console.log(this.nationalitylist);
        });

    }
    save(form): any {
        if (!form.valid) {
            return false;
        }
        this.investmentAccountService.setNationality(this.nationalitylist, this.nationalityObj);

        return true;
    }

    goToNext(form) {
        if (this.nationalityObj.blocked || this.nationalityObj.nationality === 'AMERICAN') {
            const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
            ref.componentInstance.errorTitle = this.editModalData.modalTitle;
            ref.componentInstance.errorMessage = this.editModalData.modalMessage;
            ref.componentInstance.ButtonTitle = this.editModalData.ButtonTitle;
            ref.componentInstance.selectNationalityError = INVESTMENT_ACCOUNT_ROUTE_PATHS.SELECT_NATIONALITY;
        } else if (this.nationalityObj.nationality === 'SINGAPOREAN') {
            this.singaporeQuestion = true;

            this.selectNationalityFormValues = this.investmentAccountService.getNationality();
            this.selectNationalityForm = new FormGroup({
            selectNationalitySingapore: new FormControl(this.selectNationalityFormValues.selectNationalitySingapore, Validators.required)
            });
            if (this.save(form)) {
                if (form.controls.selectNationalitySingapore.value === 'yes') {
                    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
                    ref.componentInstance.errorTitle = this.editModalData1.modalTitle1;
                    ref.componentInstance.errorMessage = this.editModalData1.modalMessage1;
                    ref.componentInstance.ButtonTitle = this.editModalData1.ButtonTitle1;
                    ref.componentInstance.selectNationalityError = INVESTMENT_ACCOUNT_ROUTE_PATHS.SELECT_NATIONALITY;
                } else {
                    this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.PERSONAL_INFO]);
                }
            } else {
                return false;
            }
        } else if (this.nationalityObj.nationality !== (this.nationalityObj.blocked || 'SINGAPOREAN' || 'AMERICAN')) {
            this.Question = true;
            this.selectNationalityFormValues = this.investmentAccountService.getNationality();
            this.selectNationalityForm = new FormGroup({
                otherCountryQuestionOne: new FormControl(this.selectNationalityFormValues.otherCountryQuestionOne, Validators.required),
                otherCountryQuestionTwo: new FormControl(this.selectNationalityFormValues.otherCoutryQuestionTwo, Validators.required)
            });
            if (this.save(form)) {
                if ((form.controls.otherCountryQuestionOne.value === 'yes' && form.controls.otherCountryQuestionTwo.value === 'yes')
                    || (form.controls.otherCountryQuestionOne.value === 'yes' && form.controls.otherCountryQuestionTwo.value === 'no')) {
                    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
                    ref.componentInstance.errorTitle = this.editModalData1.modalTitle1;
                    ref.componentInstance.errorMessage = this.editModalData1.modalMessage1;
                    ref.componentInstance.ButtonTitle = this.editModalData1.ButtonTitle1;
                    ref.componentInstance.selectNationalityError = INVESTMENT_ACCOUNT_ROUTE_PATHS.SELECT_NATIONALITY;
                } else if (form.controls.otherCountryQuestionOne.value === 'no' && form.controls.otherCountryQuestionTwo.value === 'yes') {
                    this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.PERSONAL_INFO]);
                } else {
                    this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.PERSONAL_INFO]);
                }
            }

        }
    }
}
