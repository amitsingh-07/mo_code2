import { CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ErrorModalComponent } from './../../../shared/modal/error-modal/error-modal.component';
import { NgbDateCustomParserFormatter } from './../../../shared/utils/ngb-date-custom-parser-formatter';
import { DIRECT_ROUTE_PATHS } from './../../direct-routes.constants';
import { DirectService } from './../../direct.service';

@Component({
  selector: 'app-life-protection-form',
  templateUrl: './life-protection-form.component.html',
  styleUrls: ['./life-protection-form.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
  encapsulation: ViewEncapsulation.None
})
export class LifeProtectionFormComponent implements OnInit, OnDestroy {
  dobValue;
  categorySub: any;
  modalRef: NgbModalRef;
  lifeProtectionForm: FormGroup;
  formValues: any;
  coverage_amt = '100,000';
  duration = 'Till Age 65';

  coverageAmtValuesTemp = Array(20).fill(100000).map((x, i) => x += i * 100000);
  coverageAmtValues = Array(20);
  durationValues = ['5 Years', '10 Years', 'Till Age 55', 'Till Age 60', 'Till Age 65', 'Till Age 70', 'Till Age 99',
                    'Whole Life', 'Whole Life w/Multiplier'];

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
    }

  ngOnInit() {
    /* Building the form */
    this.coverageAmtValuesTemp.forEach((element, index) => {
      this.coverageAmtValues[index] = this.directService.convertToCurrency(element);
    });
    this.formValues = this.directService.getLifeProtectionForm();
    if (this.formValues.duration !== undefined ) {
      this.selectDuration(this.formValues.dependent);
    }
    if (this.formValues.coverageAmt !== undefined ) {
      this.selectCoverageAmt(this.formValues.coverageAmt);
    }
    this.lifeProtectionForm = this.formBuilder.group({
      gender: [this.formValues.gender, Validators.required],
      dob: [this.formValues.dob, Validators.required],
      smoker: [this.formValues.smoker, Validators.required],
      coverageAmt: [this.formValues.coverageAmt],
      duration: [this.formValues.duration],
      premiumWaiver: [this.formValues.premiumWaiver]
    });
    this.categorySub = this.directService.searchBtnTrigger.subscribe((data) => {
      if (data !== '' && data === '0') {
        if (this.save()) {
          console.log('triggered');
          this.directService.setMinProdInfo(this.summarizeDetails());
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
  }

  selectCoverageAmt(in_coverage_amt) {
    this.coverage_amt = in_coverage_amt;
  }

  selectDuration(in_duration) {
    this.duration = in_duration;
  }

  showPremiumWaiverModal() {
    this.directService.showToolTipModal(
      this.translate.instant('DIRECT_LIFE_PROTECTION.PREMIUM_WAIVER.TOOLTIP.TITLE'),
      this.translate.instant('DIRECT_LIFE_PROTECTION.PREMIUM_WAIVER.TOOLTIP.MESSAGE')
      );
  }

  summarizeDetails() {
    let sum_string = '';
    sum_string += this.translate.instant('DIRECT_LIFE_PROTECTION.COVERAGE_AMT.DOLLAR') + this.coverage_amt + ', ';
    sum_string += this.duration;
    if (this.lifeProtectionForm.value.premiumWaiver === 'yes') {
      sum_string += ', Premium Waiver Rider';
    }
    return sum_string;
  }

  save() {
    const form = this.lifeProtectionForm;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });

      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = this.directService.currentFormError(form)['errorTitle'];
      ref.componentInstance.errorMessage = this.directService.currentFormError(form)['errorMessage'];
      return false;
    }
    form.value.coverageAmt = this.coverage_amt;
    form.value.duration = this.duration;
    this.directService.setLifeProtectionForm(form.value);
    return true;
  }

}
