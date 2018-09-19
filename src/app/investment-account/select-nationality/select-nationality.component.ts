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
    nationalitylists: any[];
    selectedNationality: any;
    country: any;
    afterSelectedNationality = false;
    beforeSelectedNationality = true;
    formValues: any;
    blocked: any;
    editPortfolio: string;
    Question = false;
    sigQuestion = false;
    nationalitylist: any;
    selectNationalityFormValues: any;
    editModalData: any;
    modalTitle: any;
    modalMessage: any;
    ButtonTitle: any;
    editModalData1: any;
    modalTitle1: any;
    modalMessage1: any;

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
            selectNationalitySig: new FormControl(this.selectNationalityFormValues.selectNationalitySig, Validators.required)
        });
    }
    selectNationality(nationalitylist) {
        this.nationalitylist = nationalitylist;
        this.blocked = this.nationalitylist.blocked;
        this.afterSelectedNationality = true;
        this.beforeSelectedNationality = false;
        this.Question = false;
        this.sigQuestion = false;
    }
    getNationalityList() {
        this.investmentAccountService.getNationalityList().subscribe((data) => {
            this.nationalitylists = data.objectList;
            console.log(this.nationalitylists);
        });

    }
    save(form): any {
        if (!form.valid) {
            return false;
        }
        this.investmentAccountService.setNationality(form.value);
        return true;
    }

    goToNext(form) {
        if (this.nationalitylist.blocked || this.nationalitylist.nationality === 'AMERICAN') {
            const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
            ref.componentInstance.errorTitle = this.editModalData.modalTitle;
            ref.componentInstance.errorMessage = this.editModalData.modalMessage;
            ref.componentInstance.ButtonTitle = this.editModalData.ButtonTitle;
            ref.componentInstance.selectNationalityError = INVESTMENT_ACCOUNT_ROUTE_PATHS.SELECT_NATIONALITY;
        } else if (this.nationalitylist.nationality === 'SINGAPOREAN') {
            this.sigQuestion = true;

            this.selectNationalityFormValues = this.investmentAccountService.getNationality();
            this.selectNationalityForm = new FormGroup({
                selectNationalitySig: new FormControl(this.selectNationalityFormValues.selectNationalitySig, Validators.required)
            });
            if (this.save(form)) {
                if (form.controls.selectNationalitySig.value === 'no') {
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
        } else if (this.nationalitylist.nationality !== (this.nationalitylist.blocked || 'SINGAPOREAN' || 'AMERICAN')) {
            this.Question = true;
            this.selectNationalityFormValues = this.investmentAccountService.getNationality();
            this.selectNationalityForm = new FormGroup({
                otherCoutryQuestionOne: new FormControl(this.selectNationalityFormValues.otherCoutryQuestionOne, Validators.required),
                otherCoutryQuestionTwo: new FormControl(this.selectNationalityFormValues.otherCoutryQuestionTwo, Validators.required)
            });
            if (this.save(form)) {
                if ((form.controls.otherCoutryQuestionOne.value === 'yes' && form.controls.otherCoutryQuestionTwo.value === 'yes')
                    || (form.controls.otherCoutryQuestionOne.value === 'yes' && form.controls.otherCoutryQuestionTwo.value === 'no')) {
                    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
                    ref.componentInstance.errorTitle = this.editModalData1.modalTitle1;
                    ref.componentInstance.errorMessage = this.editModalData1.modalMessage1;
                    ref.componentInstance.ButtonTitle = this.editModalData1.ButtonTitle1;
                    ref.componentInstance.selectNationalityError = INVESTMENT_ACCOUNT_ROUTE_PATHS.SELECT_NATIONALITY;
                } else if (form.controls.otherCoutryQuestionOne.value === 'no' && form.controls.otherCoutryQuestionTwo.value === 'yes') {
                } else {
                }
            }

        }
    }
}
