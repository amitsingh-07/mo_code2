import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ErrorModalComponent } from './../../../shared/modal/error-modal/error-modal.component';
import { NgbDateCustomParserFormatter } from './../../../shared/utils/ngb-date-custom-parser-formatter';
import { DirectService } from './../../direct.service';
import { CRITICAL_ILLNESS_CONST } from '../../direct.constants';
import { Subscription } from 'rxjs';
import { Util } from './../../../shared/utils/util';

@Component({
  selector: 'app-critical-illness-form',
  templateUrl: './critical-illness-form.component.html',
  styleUrls: ['./critical-illness-form.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
  encapsulation: ViewEncapsulation.None
})

export class CriticalIllnessFormComponent implements OnInit, OnDestroy {
  categorySub: any;
  criticalIllnessForm: FormGroup;
  formValues: any;
  coverage_amt = '';
  duration = '';
  doberror = false;
  coverageAmtValuesTemp = Array(10).fill(100000).map((x, i) => x += i * 100000);
  coverageAmtValues = Array(12);
  durationValues = CRITICAL_ILLNESS_CONST.DURATION_LIST;
  minDate;
  maxDate;
  radioLabelValue = [];
  radioLabelValueEarlyCI = [];
  defaultRadioStyleClass = 'direct-form-btn--radio btn';
  private userInfoSubscription: Subscription;

  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();

  constructor(
    private directService: DirectService, private modal: NgbModal,
    private translate: TranslateService,
    private formBuilder: FormBuilder, private config: NgbDatepickerConfig) {
    const today: Date = new Date();
    this.minDate = { year: (today.getFullYear() - 100), month: (today.getMonth() + 1), day: today.getDate() };
    this.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
    config.outsideDays = 'collapsed';
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.radioLabelValue = [{
        name: this.translate.instant('COMMON.LBL_MALE'),
        value: this.translate.instant('COMMON.LBL_MALE_VALUE')
      }, {
        name: this.translate.instant('COMMON.LBL_FEMALE'),
        value: this.translate.instant('COMMON.LBL_FEMALE_VALUE')
      }];
      this.radioLabelValueEarlyCI = [{
        name: this.translate.instant('COMMON.LBL_YES'),
        value: this.translate.instant('COMMON.LBL_YES_VALUE')
      }, {
        name: this.translate.instant('COMMON.LBL_NO'),
        value: this.translate.instant('COMMON.LBL_NO_VALUE')
      }];
      this.defaultRadioStyleClass = 'direct-form-btn--radio btn';
    });
    this.coverageAmtValuesTemp.push(1500000);
    this.coverageAmtValuesTemp.push(2000000);
  }

  ngOnInit() {
    /* Building the form */
    const ciAdditionalValue = [50000, 150000, 250000];
    const ciCoverageAmtValuesTemp = ciAdditionalValue.concat(this.coverageAmtValuesTemp);
    const ciCoverageAmtOrder = Util.sortAscending(ciCoverageAmtValuesTemp);
    ciCoverageAmtOrder.forEach((element, index) => {
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

    this.userInfoSubscription = this.directService.userInfoSet.subscribe((data) => {
      this.criticalIllnessForm.controls.gender.setValue(data['gender']);
      if (data['dob']) {
        this.criticalIllnessForm.controls.dob.setValue(data['dob']);
      }
    });
  }

  onGenderChange() {
    const userInfo = this.directService.getUserInfo();
    userInfo.gender = this.criticalIllnessForm.controls.gender.value;
    this.directService.updateUserInfo(userInfo);
  }

  onDobChange() {
    if (this.criticalIllnessForm.controls.dob.valid) {
      const userInfo = this.directService.getUserInfo();
      userInfo.dob = this.criticalIllnessForm.controls.dob.value;
      this.directService.updateUserInfo(userInfo);
    }
  }

  ngOnDestroy(): void {
    if (this.categorySub) {
      this.categorySub.unsubscribe();
    }
    this.userInfoSubscription.unsubscribe();
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
      sum_string += ', Early/MultiPay CI';
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
    form.value.earlyCI = (form.value.earlyCI === 'yes' || form.value.earlyCI === true) ? true : false;
    form.value.coverageAmt = this.coverage_amt;
    form.value.duration = this.duration;
    this.directService.setCriticalIllnessForm(form.value);
    return true;
  }
  showToolTip(title, desc) {
    this.directService.showToolTipModal(
      this.translate.instant('TOOL_TIP.' + title),
      this.translate.instant('TOOL_TIP.' + desc)
    );
  }
}
