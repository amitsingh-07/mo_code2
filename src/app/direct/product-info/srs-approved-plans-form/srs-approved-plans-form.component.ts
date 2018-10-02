import { CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DIRECT_ROUTE_PATHS } from './../../direct-routes.constants';

import { ErrorModalComponent } from './../../../shared/modal/error-modal/error-modal.component';
import { NgbDateCustomParserFormatter } from './../../../shared/utils/ngb-date-custom-parser-formatter';
import { DirectService } from './../../direct.service';

@Component({
  selector: 'app-srs-approved-plans-form',
  templateUrl: './srs-approved-plans-form.component.html',
  styleUrls: ['./srs-approved-plans-form.component.scss']
})
export class SrsApprovedPlansFormComponent implements OnInit, OnDestroy {
  categorySub: any;
  modalRef: NgbModalRef;
  srsApprovedPlansForm: FormGroup;
  formValues: any;
  payoutStartAge = 0;
  age;
  payoutStartAgeList = Array(100).fill(0).map((x, i) => x += i * 1);
  payoutTypeList;
  payoutType;
  constructor(
    private directService: DirectService, private modal: NgbModal,
    private parserFormatter: NgbDateParserFormatter, private translate: TranslateService,
    private formBuilder: FormBuilder, private config: NgbDatepickerConfig, private currencyPipe: CurrencyPipe) {
    const today: Date = new Date();
    config.minDate = { year: (today.getFullYear() - 100), month: (today.getMonth() + 1), day: today.getDate() };
    config.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
    config.outsideDays = 'collapsed';
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.payoutTypeList = this.translate.instant('SRS_SELECTED_PLANS.SINGLE_PREMIUM_LIST');
      this.payoutType = this.payoutTypeList[0];
      });
  }

  ngOnInit() {
    /* Building the form */
    this.formValues = this.directService.getSrsApprovedPlansForm();
    this.formValues.gender = this.formValues.gender;
    this.formValues.singlePremium = this.formValues.singlePremium ? this.formValues.singlePremium : 0;
    this.srsApprovedPlansForm = this.formBuilder.group({
      gender: [this.formValues.gender, Validators.required],
      dob: [this.formValues.dob, Validators.required],
      singlePremium: [this.formValues.singlePremium],
      payoutStartAge: [this.formValues.payoutStartAge],
      payoutType: [this.formValues.payoutType]
    });
    if (this.formValues.payoutType !== undefined) {
      this.selectPayoutType(this.formValues.payoutType);
    }
    if (this.formValues.payoutStartAge !== undefined) {
      this.selectPayoutStartAge(this.formValues.payoutStartAge);
    }
    this.categorySub = this.directService.searchBtnTrigger.subscribe((data) => {
      if (data !== '' && data === '7') {
        if (this.save()) {
          this.directService.setMinProdInfo(this.summarizeDetails());
        }
        this.directService.triggerSearch('');
      }
    });
  }

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
  }
  calculate_age(dob) {
    const diff_ms = Date.now() - dob.getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  }
  getAge() {
    const year  = this.srsApprovedPlansForm.controls.dob.value.year;
    const month  = this.srsApprovedPlansForm.controls.dob.value.month;
    const day  = this.srsApprovedPlansForm.controls.dob.value.day;
    this.age = this.calculate_age(new Date(year, month, day));
  }
  selectPayoutStartAge(payoutStartAge) {
      this.payoutStartAge = payoutStartAge;
      this.srsApprovedPlansForm.controls.payoutStartAge.setValue(this.payoutStartAge);
  }
  dobErrorModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = 'Invalid Payout age';
    ref.componentInstance.errorMessage = 'Payout age must be greater than the current age of the user';
    return false;
  }
  selectPayoutType(payoutType) {
    this.payoutType = payoutType;
    this.srsApprovedPlansForm.controls.payoutType.setValue(this.payoutType);
  }

  summarizeDetails() {
    let sum_string = '';
    sum_string += this.translate.instant('CRITICAL_ILLNESS.COVERAGE_AMT.DOLLAR') + this.srsApprovedPlansForm.value.singlePremium + ', ';
    sum_string += 'Payout Age of' + this.payoutStartAge + ', ';
    sum_string += this.payoutType;
    return sum_string;
  }

  save() {
    const form = this.srsApprovedPlansForm;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });

      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = this.directService.currentFormError(form)['errorTitle'];
      ref.componentInstance.errorMessage = this.directService.currentFormError(form)['errorMessage'];
      return false;
    }
    this.getAge();
    if (this.age >= form.controls.payoutStartAge.value) {
      this.dobErrorModal();
      return false;
    }
    this.directService.setSrsApprovedPlansForm(form.value);
    return true;
  }
}
