import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ErrorModalComponent } from './../../../shared/modal/error-modal/error-modal.component';
import { NgbDateCustomParserFormatter } from './../../../shared/utils/ngb-date-custom-parser-formatter';
import { DirectService } from './../../direct.service';

@Component({
  selector: 'app-critical-illness-form',
  templateUrl: './critical-illness-form.component.html',
  styleUrls: ['./critical-illness-form.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
  encapsulation: ViewEncapsulation.None
})

export class CriticalIllnessFormComponent implements OnInit, OnDestroy {
  categorySub: any;
  modalRef: NgbModalRef;
  criticalIllnessForm: FormGroup;
  formValues: any;
  coverage_amt = '';
  duration = '';
  doberror = false;
  coverageAmtValuesTemp = Array(10).fill(100000).map((x, i) => x += i * 100000);
  coverageAmtValues = Array(12);
  durationValues = ['5 Years', '10 Years', 'Till Age 55',
                    'Till Age 60', 'Till Age 65', 'Till Age 70',
                    'Whole Life', 'Whole life w/Multiplier'];
  minDate;
  maxDate;

  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();

  constructor(
    private directService: DirectService, private modal: NgbModal,
    private parserFormatter: NgbDateParserFormatter, private translate: TranslateService,
    private formBuilder: FormBuilder, private config: NgbDatepickerConfig, private currencyPipe: CurrencyPipe,
    private router: Router) {
    const today: Date = new Date();
    config.minDate = { year: (today.getFullYear() - 100), month: (today.getMonth() + 1), day: today.getDate() };
    config.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
    config.outsideDays = 'collapsed';
    this.translate.use('en');

    this.coverageAmtValuesTemp.push(1500000);
    this.coverageAmtValuesTemp.push(2000000);
  }

  ngOnInit() {
    /* Building the form */
    this.coverageAmtValuesTemp.forEach((element, index) => {
      this.coverageAmtValues[index] = this.directService.convertToCurrency(element);
    });
    this.formValues = JSON.parse(JSON.stringify(this.directService.getCriticalIllnessForm()));
    this.formValues.gender = this.formValues.gender;
    this.formValues.smoker = this.formValues.smoker;
    this.formValues.earlyCI = this.formValues.earlyCI;
    this.formValues.duration = this.formValues.duration;
    if (this.formValues.earlyCI !== undefined) {
      this.formValues.earlyCI = this.formValues.earlyCI ? 'yes' : 'no';
    }

    this.criticalIllnessForm = this.formBuilder.group({
      gender: [this.formValues.gender, Validators.required],
      dob: [this.formValues.dob, Validators.required],
      smoker: [this.formValues.smoker],
      coverageAmt: [this.formValues.coverageAmt, Validators.required],
      duration: [this.formValues.duration, Validators.required],
      earlyCI: [this.formValues.earlyCI, Validators.required]
    });

    if (this.formValues.duration !== undefined) {
      this.selectDuration(this.formValues.duration);
    }
    if (this.formValues.coverageAmt !== undefined) {
      this.selectCoverageAmt(this.formValues.coverageAmt);
    }

    this.categorySub = this.directService.searchBtnTrigger.subscribe((data) => {
      if (data !== '' && data === '2') {
        if (this.save()) {
          this.formSubmitted.emit(this.summarizeDetails());
          this.directService.setMinProdInfo(this.summarizeDetails());
        }
      }
    });
    this.directService.userInfoSet.subscribe((data) => {
      this.criticalIllnessForm.controls.gender.setValue(data['gender']);
      this.criticalIllnessForm.controls.dob.setValue(data['dob']);
    });
  }

  onGenderDobChange() {
    const userInfo = this.directService.getUserInfo();
    userInfo.dob = this.criticalIllnessForm.controls.dob.value;
    userInfo.gender = this.criticalIllnessForm.controls.gender.value;
    this.directService.updateUserInfo(userInfo);
  }

  ngOnDestroy(): void {
    if (this.categorySub) {
      this.categorySub.unsubscribe();
    }
  }

  selectCoverageAmt(in_coverage_amt) {
    this.coverage_amt = in_coverage_amt;
    this.criticalIllnessForm.controls.coverageAmt.setValue(this.coverage_amt);
  }

  selectDuration(in_duration) {
    this.duration = in_duration;
    this.criticalIllnessForm.controls.duration.setValue(this.duration);
  }

  summarizeDetails() {
    let sum_string = '';
    sum_string += this.translate.instant('CRITICAL_ILLNESS.COVERAGE_AMT.DOLLAR') + this.coverage_amt + ', ';
    sum_string += this.duration;
    if (this.criticalIllnessForm.value.earlyCI === true || this.criticalIllnessForm.value.earlyCI === 'yes') {
      sum_string += ', Early CI';
    }
    return sum_string;
  }

  save() {
    const form = this.criticalIllnessForm;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      if (!form.controls['dob'].valid && form.controls['gender'].valid) {
        this.doberror = true;
      }
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = this.directService.currentFormError(form)['errorTitle'];
      ref.componentInstance.errorMessage = this.directService.currentFormError(form)['errorMessage'];
      return false;
    }
    form.value.earlyCI = (form.value.earlyCI === 'yes' ||  form.value.earlyCI === true) ? true : false;
    form.value.coverageAmt = this.coverage_amt;
    form.value.duration = this.duration;
    this.directService.setCriticalIllnessForm(form.value);
    return true;
  }
}
